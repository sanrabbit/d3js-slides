var list = $('.markdown-body').children();
list.splice(0, 5);

var d3api = { name: 'd3api', children: [], href: 'https://github.com/mbostock/d3/wiki/API-Reference' };

list.each(function () {
    switch (this.tagName) {
        case 'H2':
            h2 = { name: this.children[1].innerText, href: this.children[1].href, children: [] };
            d3api.children.push(h2);
            break;
        case 'H3':
            h3 = { name: this.children[1].innerText, href: this.children[1].href, children: [] };
            h2.children.push(h3);
            break;
        case 'UL':
            $('a', this).each(function () {
                var a = { name: this.innerText, href: this.href };
                h3.children.push(a);
            });
            break;
        default:
            break;
    }
});

JSON.stringify(d3api, undefined, '  ');