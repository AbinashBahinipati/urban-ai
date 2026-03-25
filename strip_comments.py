import sys, re

def strip_js_html_css(code):
    code = re.sub(r'<!--[\s\S]*?-->', '', code)
    code = re.sub(r'/\*[\s\S]*?\*/', '', code)
    # JS single line comments: exclude if preceded by ':', quote, or backslash
    code = re.sub(r'(?<![:"\'\\])\/\/.*', '', code)
    code = re.sub(r'\n\s*\n\s*\n', '\n\n', code)
    return code

def strip_python(code):
    code = re.sub(r'^[ \t]*#.*$\n?', '', code, flags=re.MULTILINE)
    code = re.sub(r'[ \t]{2,}#.*$', '', code, flags=re.MULTILINE)
    code = re.sub(r'\n\s*\n\s*\n', '\n\n', code)
    return code

for file, strip in [('index.html', strip_js_html_css), ('server.js', strip_js_html_css), ('main/app.py', strip_python)]:
    try:
        with open(file, 'r', encoding='utf-8') as f:
            data = f.read()
        with open(file, 'w', encoding='utf-8') as f:
            f.write(strip(data))
        print(f'Stripped {file}')
    except Exception as e:
        print(f'Error {file}: {e}')
