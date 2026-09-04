import os, re

for root, dirs, files in os.walk('e:/Vipul Sir All Projects/Veka/VEKA-GenAI-Excellence'):
    for f in files:
        if f.endswith('.html'):
            path = os.path.join(root, f)
            with open(path, 'r', encoding='utf-8') as file:
                content = file.read()
            if '<meta name="description"' not in content:
                print(f"Fixing SEO for {path}")
                title_match = re.search(r'<title>(.*?)</title>', content, re.IGNORECASE)
                title = title_match.group(1).strip() if title_match else "VEKA GenAI Excellence Module"
                desc_tag = f'<meta name="description" content="Learn more about {title} with VEKA GenAI Excellence.">'
                
                if '<meta name="viewport"' in content:
                    new_content = re.sub(r'(<meta name="viewport".*?>)', r'\1\n' + desc_tag, content, 1, re.IGNORECASE)
                elif '<head>' in content:
                    new_content = re.sub(r'(<head>)', r'\1\n' + desc_tag, content, 1, re.IGNORECASE)
                else:
                    new_content = content
                    
                with open(path, 'w', encoding='utf-8') as file:
                    file.write(new_content)
