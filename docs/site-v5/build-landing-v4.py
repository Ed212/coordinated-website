"""Build the Coordinated landing page v4 (two headline variants) from one template.

A copy of simulator/build-calc.py, adapted: calc.js (the attention comparison model, unchanged)
is read from the simulator folder and inlined where the template has /*CALC*/, exactly as the
v3 build does; {{HEADLINE}} and {{VARIANT}} select the hero headline; {{ADDRESS}} is the
contact address shown as text (nothing on the page sends mail).

Usage:  python3 build-landing-v4.py [--address you@example.com] [--calc path/to/calc.js]
Outputs (next to this script): coordinated-landing-v4a.html, coordinated-landing-v4b.html,
and preview/*-preview.html (the same pages wrapped in a document skeleton for local viewing).
"""
import argparse, hashlib, pathlib, sys

HERE = pathlib.Path(__file__).resolve().parent
DEFAULT_CALC = HERE.parent.parent / 'simulator' / 'calc.js'
PLACEHOLDER = '[address to confirm]'

VARIANTS = {
    'a': ('A', 'Give your team its focus back.'),
    'b': ('B', 'Stop repeating decisions and chasing updates.'),
}

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--address', default=PLACEHOLDER, help='contact address shown as text on the page')
    ap.add_argument('--calc', default=str(DEFAULT_CALC), help='path to the unmodified simulator calc.js')
    args = ap.parse_args()

    calc_path = pathlib.Path(args.calc)
    calc = calc_path.read_text()
    digest = hashlib.sha256(calc.encode()).hexdigest()
    tpl = (HERE / 'landing-v4.tpl.html').read_text()
    for marker in ('/*CALC*/', '{{HEADLINE}}', '{{VARIANT}}', '{{ADDRESS}}'):
        if marker not in tpl:
            sys.exit('template is missing ' + marker)

    (HERE / 'preview').mkdir(exist_ok=True)
    for suffix, (variant, headline) in VARIANTS.items():
        s = (tpl.replace('/*CALC*/', calc)
                .replace('{{HEADLINE}}', headline)
                .replace('{{VARIANT}}', variant)
                .replace('{{ADDRESS}}', args.address))
        out = HERE / f'coordinated-landing-v4{suffix}.html'
        out.write_text(s)
        wrapped = ('<!doctype html><html><head><meta charset="utf-8">'
                   '<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">'
                   '<style>:root{color-scheme:light}body{margin:0;font:14px system-ui}img{max-width:100%}[hidden]{display:none!important}</style>'
                   '</head><body>' + s + '</body></html>')
        (HERE / 'preview' / f'coordinated-landing-v4{suffix}-preview.html').write_text(wrapped)
        print(out.name, len(s), 'bytes', '· headline', variant + ':', headline)
    print('calc.js', calc_path, 'sha256', digest)
    if args.address == PLACEHOLDER:
        print('WARNING: the contact address is the placeholder', repr(PLACEHOLDER), '; rebuild with --address before publishing')

if __name__ == '__main__':
    main()
