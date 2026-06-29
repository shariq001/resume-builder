from pydantic import BaseModel
from typing import Dict, List, Literal, Optional

class DimensionScore(BaseModel):
    score: int
    max_score: int
    label: str
    hint: Optional[str] = None

class ATSScoreResult(BaseModel):
    total_score: int
    grade: Literal['A', 'B', 'C', 'D', 'F']
    breakdown: Dict[str, DimensionScore]
    improvement_hints: List[str]

class KeywordMatchRequest(BaseModel):
    job_description: str

class KeywordMatchResult(BaseModel):
    match_percentage: float
    matched_keywords: List[str]
    missing_keywords: List[str]
    total_jd_keywords: int
    total_matched: int
