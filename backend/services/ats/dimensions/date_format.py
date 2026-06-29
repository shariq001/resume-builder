from typing import Dict, Any, Tuple, Optional
import re

def evaluate_date_format(form_data: Dict[str, Any]) -> Tuple[int, int, Optional[str]]:
    max_score = 15
    score = 15
    issues = False
    
    date_regex = re.compile(r'^\d{4}-\d{2}$') # basic YYYY-MM
    
    items_to_check = (form_data.get("experience") or []) + (form_data.get("education") or [])
    
    if not items_to_check:
        return score, max_score, None
        
    deduction_per_item = 15 / max(len(items_to_check), 1)
    
    for item in items_to_check:
        start = item.get("startDate")
        end = item.get("endDate")
        
        if start and not date_regex.match(start):
            score -= deduction_per_item
            issues = True
        if end and not date_regex.match(end):
            score -= deduction_per_item
            issues = True
            
    score = max(0, int(score))
    hint = "Ensure all dates are completely filled in MM/YYYY format." if issues else None
    return score, max_score, hint
