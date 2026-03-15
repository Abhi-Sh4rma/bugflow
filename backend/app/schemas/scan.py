from pydantic import BaseModel
from datetime import datetime
from typing import Optional, List, Any

class ScanCreate(BaseModel):
    domain: str

class ScanResponse(BaseModel):
    id: int
    domain: str
    status: str
    created_at: datetime
    completed_at: Optional[datetime] = None
    subdomains: Optional[List[Any]] = []
    ports: Optional[List[Any]] = []
    technologies: Optional[List[Any]] = []
    vulnerabilities: Optional[List[Any]] = []
    cves: Optional[List[Any]] = []
    ai_report: Optional[str] = None
    critical_count: int = 0
    high_count: int = 0
    medium_count: int = 0
    info_count: int = 0

    class Config:
        from_attributes = True

class ScanSummary(BaseModel):
    id: int
    domain: str
    status: str
    created_at: datetime
    critical_count: int = 0
    high_count: int = 0
    medium_count: int = 0
    info_count: int = 0

    class Config:
        from_attributes = True
