import re

file_path = r'c:\Users\pruth\OneDrive\Desktop\New Project from  vipul  sir\VEKA-GenAI-Excellence\deck\index.html'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Make the UI ultra-premium with glassmorphism and modern gradients
css_enhancements = {
    # Enhancing colors and backgrounds
    '--bg:#0E1116;': '--bg:#09090b;\n    --bg-glass: rgba(26, 33, 43, 0.45);',
    '--bg2:#151A22;': '--bg2:rgba(21, 26, 34, 0.6);\n    backdrop-filter: blur(12px);\n    -webkit-backdrop-filter: blur(12px);',
    
    # Adding modern gradients to the main title
    'h1.big{font-family:var(--display);font-weight:700;line-height:1.02;\n    font-size:clamp(38px,6.2vw,88px);letter-spacing:-.02em}': 'h1.big{\n    font-family:var(--display);font-weight:800;line-height:1.02;\n    font-size:clamp(38px,6.2vw,88px);letter-spacing:-.03em;\n    background: linear-gradient(135deg, #fff 0%, #e5e5e5 50%, #a3a3a3 100%);\n    -webkit-background-clip: text;\n    -webkit-text-fill-color: transparent;\n    background-clip: text;\n}',
    
    # Adding glassmorphism to floating timer and overlays
    '#timer{position:fixed;bottom:66px;right:22px;z-index:8;background:var(--panel);\n    border:1px solid var(--line);border-radius:16px;padding:14px 16px;display:none;\n    box-shadow:0 18px 50px rgba(0,0,0,.5);min-width:190px}': '#timer{\n    position:fixed;bottom:66px;right:22px;z-index:8;\n    background: var(--bg-glass);\n    backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px);\n    border:1px solid rgba(255,255,255,0.1); border-radius:16px; padding:16px 20px; display:none;\n    box-shadow: 0 20px 40px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.1);\n    min-width:200px;\n}',
    
    # Overlays
    '.overlay{position:fixed;inset:0;z-index:20;background:rgba(8,10,14,.94);backdrop-filter:blur(8px);\n    display:none;padding:clamp(30px,5vw,70px);overflow:auto}': '.overlay{\n    position:fixed;inset:0;z-index:20;\n    background:rgba(0, 0, 0, 0.85); backdrop-filter:blur(12px); -webkit-backdrop-filter:blur(12px);\n    display:none;padding:clamp(30px,5vw,70px);overflow:auto;\n}',
    
    # Bottom bar buttons hover state
    '.navbtn:hover{border-color:var(--red);color:var(--red);transform:translateY(-1px)}': '.navbtn:hover{border-color:var(--red);color:var(--red);transform:translateY(-2px);box-shadow: 0 4px 12px rgba(228,0,43,0.3);}',
    
    # Checkpoint blocks
    '.chk{background:var(--bg2);border:1px solid var(--line);border-radius:16px;padding:30px 34px;margin-top:22px}': '.chk{\n    background: var(--bg-glass);\n    backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px);\n    border:1px solid rgba(255,255,255,0.12);\n    border-radius:16px;padding:30px 34px;margin-top:22px;\n    box-shadow: 0 10px 30px rgba(0,0,0,0.3);\n}',
    
    # Battle VS text
    '.battle .vs{font-family:var(--display);font-size:clamp(50px,9vw,120px);font-weight:700;color:var(--red);\n    letter-spacing:-.03em;line-height:1}': '.battle .vs{\n    font-family:var(--display);font-size:clamp(50px,9vw,120px);font-weight:900;\n    background: linear-gradient(135deg, #ff4d6d 0%, var(--red) 50%, #800020 100%);\n    -webkit-background-clip: text; -webkit-text-fill-color: transparent;\n    letter-spacing:-.04em;line-height:1; filter: drop-shadow(0 4px 12px rgba(228,0,43,0.4));\n}'
}

for old, new in css_enhancements.items():
    content = content.replace(old, new)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("Deck polished successfully.")
