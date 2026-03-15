import sys
import os
sys.path.insert(0, '/root/reconai')

# Import models first to register them
from app.models.user import User
from app.models.scan import Scan
from app.core.database import AsyncSessionLocal
from sqlalchemy import select
import asyncio
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.models.scan import Scan
from app.core.database import AsyncSessionLocal
import asyncio

async def update_scan(scan_id: int, updates: dict):
    async with AsyncSessionLocal() as db:
        result = await db.execute(select(Scan).where(Scan.id == scan_id))
        scan = result.scalar_one_or_none()
        if scan:
            for key, value in updates.items():
                setattr(scan, key, value)
            await db.commit()

async def run_scan_pipeline(scan_id: int, domain: str):
    print(f"\n🚀 Starting scan pipeline for {domain} (Scan #{scan_id})")

    try:
        # Update status to running
        await update_scan(scan_id, {"status": "running"})

        # Import ReconAI modules
        from backend.scanner.subdomain import enumerate_subdomains
        from backend.scanner.dns_resolve import resolve_subdomains
        from backend.scanner.port_scan import scan_ports
        from backend.scanner.tech_detect import detect_technologies
        from backend.scanner.cve_match import match_cves
        from backend.scanner.vuln_check import run_vuln_checks
        from backend.ai.report_gen import generate_report
        from backend.database.db import init_db, get_connection

        # Init ReconAI database
        init_db()
        conn = get_connection()
        cursor = conn.cursor()
        cursor.execute(
            "INSERT INTO scans (domain) VALUES (?)",
            (domain,)
        )
        conn.commit()
        recon_scan_id = cursor.lastrowid
        conn.close()

        # Stage 1: Subdomain Enumeration
        print(f"[1/6] 🔍 Subdomain Enumeration")
        subdomains = enumerate_subdomains(domain, recon_scan_id)
        all_hosts = list(set([domain] + (subdomains or [])))
        await update_scan(scan_id, {
            "subdomains": [{"subdomain": s, "is_alive": False} for s in subdomains] if subdomains else []
        })

        # Stage 2: DNS Resolution
        print(f"[2/6] 🌐 DNS Resolution")
        dns_results = resolve_subdomains(recon_scan_id, all_hosts)
        alive_hosts = [r["subdomain"] for r in dns_results if r["is_alive"]]
        if not alive_hosts:
            alive_hosts = [domain]
        await update_scan(scan_id, {
            "subdomains": dns_results
        })

        # Stage 3: Port Scanning
        print(f"[3/6] 🔌 Port Scanning")
        port_results = scan_ports(recon_scan_id, alive_hosts)
        await update_scan(scan_id, {"ports": port_results})

        # Stage 4: Tech Fingerprinting
        print(f"[4/6] 🔎 Tech Fingerprinting")
        tech_results = detect_technologies(recon_scan_id, alive_hosts)
        techs = []
        for t in tech_results:
            if t.get("server"):
                techs.append(t["server"])
            techs.extend(t.get("technologies", []))
            techs.extend(t.get("frameworks", []))
        await update_scan(scan_id, {"technologies": list(set(techs))})

        # Stage 5: CVE Matching
        print(f"[5/6] 🛡️  CVE Matching")
        cve_results = match_cves(recon_scan_id, tech_results)
        await update_scan(scan_id, {"cves": cve_results})

        # Stage 6: Vulnerability Checks
        print(f"[6/6] ⚡ Vulnerability Checks")
        vuln_results = run_vuln_checks(recon_scan_id, alive_hosts)

        # Count severities
        critical = len([v for v in vuln_results if v.get("severity") == "Critical"])
        high = len([v for v in vuln_results if v.get("severity") == "High"])
        medium = len([v for v in vuln_results if v.get("severity") == "Medium"])
        info = len([v for v in vuln_results if v.get("severity") == "Info"])

        await update_scan(scan_id, {
            "vulnerabilities": vuln_results,
            "critical_count": critical,
            "high_count": high,
            "medium_count": medium,
            "info_count": info
        })

        # Stage 7: AI Report
        print(f"[7/7] 🤖 AI Report Generation")
        groq_key = os.getenv("GROQ_API_KEY")
        if groq_key:
            report = generate_report(recon_scan_id, groq_key)
            if report:
                await update_scan(scan_id, {"ai_report": report})

        # Mark completed
        from datetime import datetime
        await update_scan(scan_id, {
            "status": "completed",
            "completed_at": datetime.utcnow()
        })
        print(f"\n✅ Scan #{scan_id} completed!")

    except Exception as e:
        print(f"\n❌ Scan #{scan_id} failed: {e}")
        await update_scan(scan_id, {"status": "failed"})
