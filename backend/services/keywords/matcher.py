import re
from typing import Dict, Any, List
from collections import Counter
from backend.schemas.ats import KeywordMatchResult

STOP_WORDS = {"and", "the", "a", "an", "of", "to", "in", "for", "with", "on", "at", "by", "from", "is", "are", "be", "this", "that", "it", "or", "as", "you", "your", "we", "our"}

def tokenize(text: str) -> set[str]:
    words = re.findall(r'\b[a-z0-9]+\b', text.lower())
    return {w for w in words if w not in STOP_WORDS}

def get_job_keywords(jd: str) -> List[str]:
    words = re.findall(r'\b[a-z0-9]+\b', jd.lower())
    return [w for w in words if w not in STOP_WORDS]

def extract_resume_keywords(form_data: Dict[str, Any]) -> set[str]:
    keywords = set()
    
    for s in (form_data.get("skills") or []):
        keywords.update(tokenize(s))
        
    for cert in (form_data.get("certifications") or []):
        for s in (cert.get("skills_acquired") or []):
            keywords.update(tokenize(s))
            
    for proj in (form_data.get("projects") or []):
        for s in (proj.get("used_skills") or []):
            keywords.update(tokenize(s))
            
    for exp in (form_data.get("experience") or []):
        desc = exp.get("description") or ""
        keywords.update(tokenize(desc))
        
    return keywords

def match(job_description: str, form_data: Dict[str, Any]) -> KeywordMatchResult:
    jd_tokens_list = get_job_keywords(job_description)
    jd_keywords = set(jd_tokens_list)
    
    resume_keywords = extract_resume_keywords(form_data)
    
    matched_keywords = list(jd_keywords.intersection(resume_keywords))
    matched_keywords.sort()
    
    missing = jd_keywords - resume_keywords
    freq = Counter(jd_tokens_list)
    missing_keywords = sorted(list(missing), key=lambda k: freq[k], reverse=True)
    
    total_jd = len(jd_keywords)
    total_matched = len(matched_keywords)
    
    match_percentage = round((total_matched / total_jd * 100), 1) if total_jd > 0 else 0.0
    
    return KeywordMatchResult(
        match_percentage=match_percentage,
        matched_keywords=matched_keywords,
        missing_keywords=missing_keywords,
        total_jd_keywords=total_jd,
        total_matched=total_matched
    )
