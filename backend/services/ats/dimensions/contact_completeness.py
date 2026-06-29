from typing import Dict, Any, Tuple, Optional

def evaluate_contact_completeness(form_data: Dict[str, Any]) -> Tuple[int, int, Optional[str]]:
    max_score = 15
    contact = form_data.get("contact") or {}
    
    fields = ["fullName", "email", "phone", "location"]
    present = [f for f in fields if contact.get(f)]
    
    score = int((len(present) / len(fields)) * max_score)
    
    missing = [f for f in fields if f not in present]
    hint = f"Missing contact fields: {', '.join(missing)}" if missing else None
    
    return score, max_score, hint
