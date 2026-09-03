import csv
import random

months = ['2025-10', '2025-11', '2025-12', '2026-01', '2026-02', '2026-03', '2026-04', '2026-05', '2026-06', '2026-07', '2026-08', '2026-09']
dealers = {
    'Dealer A': {'region': 'West', 'tier': 'Metro', 'since': '2018', 'base_vol': 100, 'base_achieve': 95.5, 'audit': 95.2, 'total_complaints': 17},
    'Dealer B': {'region': 'West', 'tier': 'Metro', 'since': '2019', 'base_vol': 90, 'base_achieve': 96.8, 'audit': 63.3, 'total_complaints': 26},
    'Dealer C': {'region': 'West', 'tier': 'Tier-2', 'since': '2020', 'base_vol': 70, 'base_achieve': 94.7, 'audit': 84.1, 'total_complaints': 15},
    'Dealer D': {'region': 'West', 'tier': 'Metro', 'since': '2015', 'base_vol': 85, 'base_achieve': 96.2, 'audit': 83.5, 'total_complaints': 18},
    'Dealer E': {'region': 'West', 'tier': 'Tier-2', 'since': '2021', 'base_vol': 30, 'base_achieve': 70.5, 'audit': 85.0, 'total_complaints': 13},
    'Dealer F': {'region': 'West', 'tier': 'Tier-3', 'since': '2022', 'base_vol': 40, 'base_achieve': 96.9, 'audit': 84.5, 'total_complaints': 17},
    'Dealer G': {'region': 'North', 'tier': 'Metro', 'since': '2016', 'base_vol': 110, 'base_achieve': 97.3, 'audit': 84.3, 'total_complaints': 19},
    'Dealer H': {'region': 'North', 'tier': 'Tier-2', 'since': '2017', 'base_vol': 65, 'base_achieve': 94.0, 'audit': 84.7, 'total_complaints': 9},
    'Dealer I': {'region': 'North', 'tier': 'Metro', 'since': '2019', 'base_vol': 95, 'base_achieve': 94.2, 'audit': 84.5, 'total_complaints': 12},
    'Dealer J': {'region': 'North', 'tier': 'Tier-3', 'since': '2020', 'base_vol': 45, 'base_achieve': 93.6, 'audit': 82.2, 'total_complaints': 20},
    'Dealer K': {'region': 'North', 'tier': 'Tier-2', 'since': '2018', 'base_vol': 50, 'base_achieve': 73.2, 'audit': 85.2, 'total_complaints': 8},
    'Dealer L': {'region': 'South', 'tier': 'Metro', 'since': '2015', 'base_vol': 105, 'base_achieve': 95.8, 'audit': 94.7, 'total_complaints': 26},
    'Dealer M': {'region': 'South', 'tier': 'Metro', 'since': '2016', 'base_vol': 88, 'base_achieve': 94.3, 'audit': 84.7, 'total_complaints': 12},
    'Dealer N': {'region': 'South', 'tier': 'Tier-2', 'since': '2021', 'base_vol': 42, 'base_achieve': 77.7, 'audit': 84.3, 'total_complaints': 13},
    'Dealer O': {'region': 'South', 'tier': 'Tier-3', 'since': '2019', 'base_vol': 35, 'base_achieve': 94.8, 'audit': 82.8, 'total_complaints': 6},
    'Dealer P': {'region': 'South', 'tier': 'Tier-2', 'since': '2017', 'base_vol': 60, 'base_achieve': 95.6, 'audit': 82.4, 'total_complaints': 18},
    'Dealer Q': {'region': 'East', 'tier': 'Tier-2', 'since': '2020', 'base_vol': 75, 'base_achieve': 94.9, 'audit': 62.3, 'total_complaints': 35},
    'Dealer R': {'region': 'East', 'tier': 'Metro', 'since': '2018', 'base_vol': 92, 'base_achieve': 94.7, 'audit': 84.9, 'total_complaints': 12},
    'Dealer S': {'region': 'East', 'tier': 'Tier-3', 'since': '2022', 'base_vol': 38, 'base_achieve': 95.5, 'audit': 83.0, 'total_complaints': 6},
    'Dealer T': {'region': 'East', 'tier': 'Tier-2', 'since': '2021', 'base_vol': 55, 'base_achieve': 95.1, 'audit': 84.3, 'total_complaints': 22},
}

columns = [
    'Dealer_Code', 'Region', 'City_Tier', 'Dealer_Since', 'Month',
    'Order_Volume_Index', 'Target_Index', 'Achievement_Percent', 'Order_Value_Index',
    'Premium_Mix_Percent', 'Order_To_Dispatch_Days', 'On_Time_Dispatch_Percent',
    'Short_Supply_Incidents', 'Complaints_Raised', 'Complaints_Closed',
    'Open_Complaint_Age_Days', 'Top_Defect_Category', 'Outstanding_Index',
    'Overdue_Days', 'Credit_Utilisation_Percent', 'Training_Sessions_Attended',
    'Fabrication_Audit_Score', 'Risk_Level', 'Notes'
]

def distribute_complaints(total):
    # distribute random ints that sum up to total across 12 months
    counts = [0]*12
    for _ in range(total):
        counts[random.randint(0, 11)] += 1
    return counts

defects_by_region = {
    'East': ['Sash alignment', 'Gasket seating', 'Hardware fitment'],
    'West': ['Reinforcement omission', 'Hardware fitment', 'Surface mark'],
    'North': ['Surface mark', 'Welded corner finish'],
    'South': ['Hardware fitment', 'Welded corner finish']
}

with open('data/VEKA_Channel_Ops_Synthetic_240rows.csv', 'w', newline='') as csvfile:
    writer = csv.DictWriter(csvfile, fieldnames=columns)
    writer.writeheader()

    for d_code, d_info in dealers.items():
        complaints = distribute_complaints(d_info['total_complaints'])
        
        for m_idx, month in enumerate(months):
            row = {}
            row['Dealer_Code'] = d_code
            row['Region'] = d_info['region']
            row['City_Tier'] = d_info['tier']
            row['Dealer_Since'] = d_info['since']
            row['Month'] = month
            
            # Setup specific volume rules
            # E, K, N declines
            if d_code == 'Dealer E': # 30.4 -> 12.5
                vol = 30.4 - ((30.4 - 12.5) / 11) * m_idx
                achieve = 70.5 + random.uniform(-2, 2)
            elif d_code == 'Dealer K': # 50.8 -> 22.2
                vol = 50.8 - ((50.8 - 22.2) / 11) * m_idx
                achieve = 73.2 + random.uniform(-2, 2)
            elif d_code == 'Dealer N': # 41.5 -> 22.3
                vol = 41.5 - ((41.5 - 22.3) / 11) * m_idx
                achieve = 77.7 + random.uniform(-2, 2)
            else:
                vol = d_info['base_vol'] * random.uniform(0.9, 1.1)
                achieve = d_info['base_achieve'] + random.uniform(-1.5, 1.5)
            
            row['Order_Volume_Index'] = round(vol, 1)
            row['Achievement_Percent'] = round(achieve, 1)
            row['Target_Index'] = round(vol / (achieve/100), 1)
            row['Order_Value_Index'] = round(vol * random.uniform(1.2, 1.4), 1)
            
            # Premium mix
            if d_info['region'] == 'North': # drops from ~30.8% to ~17.1%
                mix = 30.8 - ((30.8 - 17.1) / 11) * m_idx
            else:
                mix = 33.0 + random.uniform(-3, 3)
            row['Premium_Mix_Percent'] = round(mix, 1)
            
            # Supply
            if d_info['region'] == 'East':
                if m_idx < 5: # first 5 months avg 16.7, on time 55.2
                    row['Order_To_Dispatch_Days'] = round(random.uniform(15, 18), 1)
                else: # last 6 months 20.0
                    row['Order_To_Dispatch_Days'] = round(random.uniform(19, 21), 1)
                row['On_Time_Dispatch_Percent'] = round(random.uniform(50, 60), 1)
                row['Short_Supply_Incidents'] = random.randint(2, 4) if m_idx >= 5 else random.randint(0, 2)
            else:
                row['Order_To_Dispatch_Days'] = round(random.uniform(10, 13), 1)
                row['On_Time_Dispatch_Percent'] = round(random.uniform(70, 75), 1)
                row['Short_Supply_Incidents'] = random.randint(0, 1)
                
            # Quality
            row['Complaints_Raised'] = complaints[m_idx]
            row['Complaints_Closed'] = max(0, complaints[m_idx] - random.randint(0, 1))
            row['Open_Complaint_Age_Days'] = random.randint(10, 50) if row['Complaints_Raised'] > 0 else 0
            
            if row['Complaints_Raised'] > 0:
                row['Top_Defect_Category'] = random.choice(defects_by_region[d_info['region']])
            else:
                row['Top_Defect_Category'] = 'None'
                
            # Credit
            if d_code == 'Dealer Q':
                # peaks at 117
                overdue = 117 if m_idx == 8 else random.randint(30, 90)
            elif d_code == 'Dealer C':
                # reaches 107, utilization climbing
                overdue = 107 if m_idx == 11 else random.randint(20, 80)
            else:
                overdue = 0
                
            row['Overdue_Days'] = overdue
            row['Outstanding_Index'] = round(vol * random.uniform(0.5, 0.8), 1)
            if d_code == 'Dealer C':
                row['Credit_Utilisation_Percent'] = round(60 + (40/11)*m_idx, 1)
            else:
                row['Credit_Utilisation_Percent'] = round(random.uniform(40, 80), 1)
            
            row['Training_Sessions_Attended'] = random.randint(0, 2)
            row['Fabrication_Audit_Score'] = round(d_info['audit'] + random.uniform(-1, 1), 1)
            
            risk_map = {
                'Dealer Q': 'Critical',
                'Dealer E': 'Losing',
                'Dealer K': 'Losing',
                'Dealer N': 'Watch',
                'Dealer B': 'Brand risk',
                'Dealer C': 'Credit',
                'Dealer T': 'Caution',
                'Dealer J': 'Caution',
                'Dealer P': 'Caution',
                'Dealer H': 'Caution',
                'Dealer A': 'Best',
                'Dealer L': 'Best'
            }
            row['Risk_Level'] = risk_map.get(d_code, 'Stable')
            row['Notes'] = ''
            
            writer.writerow(row)
