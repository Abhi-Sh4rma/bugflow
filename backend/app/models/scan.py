from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, Text, JSON
from sqlalchemy.orm import relationship
from datetime import datetime
from app.core.database import Base

class Scan(Base):
    __tablename__ = "scans"

    id = Column(Integer, primary_key=True, index=True)
    domain = Column(String, nullable=False)
    status = Column(String, default="pending")
    user_id = Column(Integer, ForeignKey("users.id"))
    created_at = Column(DateTime, default=datetime.utcnow)
    completed_at = Column(DateTime, nullable=True)

    # Results
    subdomains = Column(JSON, default=[])
    ports = Column(JSON, default=[])
    technologies = Column(JSON, default=[])
    vulnerabilities = Column(JSON, default=[])
    cves = Column(JSON, default=[])
    ai_report = Column(Text, nullable=True)

    # Severity counts
    critical_count = Column(Integer, default=0)
    high_count = Column(Integer, default=0)
    medium_count = Column(Integer, default=0)
    info_count = Column(Integer, default=0)

    # Relationships
    owner = relationship("User", back_populates="scans")

    def __repr__(self):
        return f"<Scan {self.domain} - {self.status}>"
