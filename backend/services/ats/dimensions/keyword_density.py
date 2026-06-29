from typing import Dict, Any, Tuple, Optional

def evaluate_keyword_density(form_data: Dict[str, Any]) -> Tuple[int, int, Optional[str]]:
    max_score = 15
    
    skills = form_data.get("skills") or []
    count = len(skills)
    
    score = min(count, 15)
    hint = "Add more relevant keywords to your skills section." if score < max_score else None
    
    return score, max_score, hint
