import base64

with open(r'c:\Users\anton\Documents\Hudl-Playbook-Converter\route-tree.png', 'rb') as f:
    b64 = base64.b64encode(f.read()).decode()

with open(r'c:\Users\anton\Documents\Hudl-Playbook-Converter\netlify\functions\route-tree-data.js', 'w') as out:
    out.write('// Auto-generated route tree image (base64 PNG)\n')
    out.write('export const routeTreeBase64 = "' + b64 + '";\n')

print(f'Created route-tree-data.js ({len(b64)} chars)')
