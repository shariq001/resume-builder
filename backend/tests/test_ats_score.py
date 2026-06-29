from backend.services.ats.score import compute_score

def test_compute_score_perfect():
    form_data = {
        "contact": {
            "fullName": "Jane Doe",
            "email": "jane@example.com",
            "phone": "123",
            "location": "NY"
        },
        "summary": "Experienced dev",
        "experience": [
            {
                "jobTitle": "Dev",
                "organization": "Tech",
                "startDate": "2020-01",
                "endDate": "2021-01"
            }
        ],
        "education": [
            {
                "startDate": "2015-09",
                "endDate": "2019-05"
            }
        ],
        "skills": ["Python", "React", "AWS"] * 5 # 15 skills for max density
    }
    
    result = compute_score(form_data, 1)
    
    assert result.total_score == 100
    assert result.grade == 'A'
    assert len(result.improvement_hints) == 0

def test_compute_score_missing_sections():
    form_data = {}
    result = compute_score(form_data, 1)
    
    # Base score deductions
    # Structure: 0
    # Headings: 20
    # Date format: 15
    # Contact: 0
    # Keyword: 0
    # Layout: 10
    # Total = 45
    
    assert result.total_score == 45
    assert result.grade == 'D'
    assert len(result.improvement_hints) > 0

def test_compute_score_date_issues():
    form_data = {
        "experience": [
            {"startDate": "Jan 2020"} # Bad format
        ]
    }
    result = compute_score(form_data, 1)
    assert result.breakdown["Date Format Compliance"].score == 0

def test_compute_score_layout_safety():
    form_data = {}
    result = compute_score(form_data, 4)
    assert result.breakdown["Layout Safety"].score == 8
    
    result_fail = compute_score(form_data, 99)
    assert result_fail.breakdown["Layout Safety"].score == 0
