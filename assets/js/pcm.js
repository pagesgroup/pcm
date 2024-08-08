window.addEventListener('load', async e => {
    const url = new URL(document.location);
    const pcm = await fetch(`/api/docs/assets/yaml/pcm`).then(e => e.json());
    const {properties} = pcm.quote;
    if (url.searchParams.has('projectnr')) {
        const projectnr = url.searchParams.get('projectnr');
        const dataurl = `/api/?json=${projectnr}`;
        let row = await fetch(dataurl).then(e => e.json());
        console.log({pcm,row});
        $(document.body).clear().append(
            $('form').properties({row, properties}, true).on('change', e => {
                data = Object.fromEntries(new FormData(e.target.form));
                console.log({data});
                fetch(dataurl, {method: 'POST', body: JSON.stringify(data)});
                build();
            }).append(
                $('div').class('spec'),
                // $('input').type('submit').value('OK'),
            ),
        );
    
        function build(){
            const props = Object.entries(properties);
            const legends = props.map(p => p[1].legend).unique();
            function propcell(entry){
                const [name,prop] = entry;
                console.log({name})
                const tr = $('tr').append(
                    $('th').text(prop.title || name).style('width:60mm;'),
                )
                const td = $('td').parent(tr);
                if (prop.options) {
                    const option = prop.options.find(o => o.value == row[name]) || {};
                    td.text(option.title || option.value, prop.unit);
                    if (option.description) {
                        $('div').parent(td).text(option.description);
                     }
                     if (option.image) {
                        $('img').parent(td).src('assets/image/'+option.image).style('display:block;max-height:60mm;');
                     }
                  } else {
                    td.text(row[name]);
                }
                return tr;
            }
            $('div.spec').clear().append(
                legends.map(legend => [
                    $('h1').text(legend),
                    $('table').class('grid').style('width:100%;').append(
                        $('tbody').append(
                            props.filter(([n,p]) => p.legend == legend).map(propcell),
                        ),
                    )
                ])
            );
        }
    
        build();
    } else {
        console.log({pcm});
        const props = Object.entries(properties);
        const legends = props.map(p => p[1].legend).unique();
        function propcell(entry){
            const [name,prop] = entry;
            const tr = $('tr').append(
                $('th').text(prop.title || name).style('width:60mm;'),
            )
            const td = $('td').parent(tr);
            if (prop.options) {
                const ol = $('ol').parent(td);
                prop.options.forEach(option => {
                    const li = $('li').parent(ol).text(option.title || option.value);
                    if (option.description) {
                        $('div').parent(li).text(option.description);
                     }
                     if (option.image) {
                        $('img').parent(li).src('assets/image/'+option.image).style('display:block;max-height:60mm;');
                     }
                })
            }
            return tr;
        }
        $(document.body).class('manual').clear().append(
            legends.map(legend => [
                $('h1').text(legend),
                $('table').class('grid').style('width:100%;').append(
                    $('tbody').append(
                        props.filter(([n,p]) => p.legend == legend).map(propcell),
                    ),
                )
            ])
        );
    }
})