console.log('PCM-JV');
window.addEventListener('load', async e => {
    const url = new URL(document.location);
    const pcmuri = `https://aliconnect.nl/pagesgroup/api/index.php?json=pcm`;
    if (url.searchParams.has('publish')) {
        const pcm = await fetch('/api/docs/assets/yaml/pcm', {cache: "reload"}).then(e => e.json());
        await fetch(pcmuri, {method: 'POST', body: JSON.stringify(pcm)});
    }
    const pcm = await fetch(pcmuri, {cache: "reload"}).then(e => e.json());
    const {properties} = pcm.quote;
    if (url.searchParams.has('projectnr')) {
        const projectnr = url.searchParams.get('projectnr');
        const dataurl = `https://aliconnect.nl/pagesgroup/api/index.php?json=${projectnr}`;
        let row = await fetch(dataurl).then(e => e.json());
        console.log({pcm, row});
        $(document.body).clear().append(
            $('div').style('display:flex;height:100vh;').append(
                $('form').style('flex:1 0 auto;overflow:auto;').properties({row, properties}, true).on('change', e => {
                    data = Object.fromEntries(new FormData(e.target.form));
                    console.log('Pointer, here I am working');
                    console.log({data});
                    fetch(dataurl, {method: 'POST', body: JSON.stringify(data)});
                    build();
                }),
                $('div').class('spec'),
            ),
        );
        function build(){
            const props = Object.entries(properties);
            const legends = props.map(p => p[1].legend).filter(legend => 
                props.some(([n, p]) => p.legend === legend)
            ).unique();
            const doc = {
                body(title, content) {
                    return $('div').class('spec').append(
                        $('link').href("/postkantoor/App/pcm/assets/css/doc.css").rel("stylesheet"),
                        $('link').href("https://aliconnect.nl/sdk-1.0.0/lib/aim/font/AliconnectIcons.css").rel("stylesheet"),
                        $('table').style('width:100%;table-layout:fixed;').append(
                            $('thead').append(
                                $('tr').append(
                                    $('td').colspan(2).style('padding:0 0 0 10mm;').append(
                                        $('table').style('width:100%;table-layout:fixed;margin:0 0 5mm 0;').append(
                                            $('tbody').append(
                                                $('tr').append(
                                                    $('td').append($('img').src('assets/image/logo-pages.png').style('height:8mm;')),
                                                    $('td').append($('img').src('assets/image/logo-polymac.jpg').style('height:8mm;')).style('width:50mm;'),
                                                )
                                            )
                                        )
                                    )
                                )
                            ),
                            $('tbody').append(
                                $('tr').append(
                                    $('td').colspan(2).style('padding:0 0 0 10mm;').append(
                                        $('div').text(title).style('font-weight:bold;font-size:1.2em;'),
                                        content,
                                    ),
                                ),
                            ),
                            $('tfoot').append(
                                $('tr').append(
                                    $('td').colspan(2).style('height:15mm;').append(
                                        $('table').style('position:fixed;bottom:0;width:100%;table-layout:fixed;margin:0;').append(
                                            $('tbody').append(
                                                $('tr').append(
                                                    $('td').text(title).style('width:50mm;font-size:0.8em;'),
                                                )
                                            )
                                        )
                                    )
                                )
                            ),
                        ),
                    );
                },
                async ce() {
                    return doc.body('EC Declaration of Incorporation for Partly Completed Machinery', $('div').class('ce').append(
                        $('div').text('(in accordance with annex II.1.B. of Machinery Directive 2006/42/EC)').style('font-weight:bold;font-size:0.9em;'),
                        $('table').append(
                            $('tr').append(
                                $('th').text('The manufacturer:'),
                                $('td').append(
                                    $('div').text('Polymac b.v.'),
                                    $('div').text('Morsestraat 20'),
                                    $('div').text('6716 AH Ede'),
                                    $('div').text('Nederland'),
                                    $('div').text('Tel.: +31(0)318 648 600'),
                                ),
                            ),
                        ),
                        $('p').text('Hereby declares that the following machinery:'),
                        $('table').append(
                            $('tr').append(
                                $('th').text('Description of Machine:'),
                                $('td').text('In-mold Labeling Machine with Assembly'),
                            ),
                            $('tr').append(
                                $('th').text('Type:'),
                                $('td').text('PLEA'),
                            ),
                            $('tr').append(
                                $('th').text('Serial number:'),
                                $('td').text('PLEA 230518 SE'),
                            ),
                            $('tr').append(
                                $('th').text('Year of construction:'),
                                $('td').text('2024'),
                            ),
                        ),
                        $('p').html('Fulfills all of the relevant requirements of <b>EC Machinery Directive 2006/42/EG.</b>'),
                        $('p').text('The machine also fulfills the following requirements:'),
                        $('table').append(
                            $('tr').append(
                                $('td').text('2014/35/EC'),
                                $('td').html('<b>Low Voltage Directive</b> (only the essential requirements)'),
                            ),
                            $('tr').append(
                                $('td').text('2014/30/EC'),
                                $('td').html('<b>Electromagnetic Safety</b>'),
                            ),
                        ),
                        $('p').text('Applicable EU harmonized standards:'),
                        $('table').append(
                            [
                                ['NEN-EN-ISO 12100 (2010)','Safety of machinery - General principles for design - Risk assessment and risk reduction'],
                                ['NEN-EN-ISO 13849-1 (2016)','Safety of machinery - Safety-related parts of control systems<br>Part 1: General principles of design'],
                                ['NEN-EN-ISO 13850 (2015)','Safety of machinery - Emergency stop - Principles for design'],
                                ['NEN-EN-ISO 13855 (2010)','Safety of machinery - Positioning of safeguards with respect to the approach speeds of parts of the human body'],
                                ['NEN-EN-ISO 13857 (2019)','Safety of machinery - Safety distances to prevent hazard zones being reached by upper and lower limbs'],
                                ['NEN-EN-ISO 14118 (2018)','Safety of machinery - Prevention of unexpected start-up'],
                                ['NEN-EN-ISO 14120 (2015)','Safety of machinery - Guards - General requirements for the design and construction of fixed and movable guards'],
                                ['NEN-EN-IEC 60204-1 (2018)','Safety of machinery - Electrical equipment of machines<br>Part 1: General requirements'],
                                ['NEN-EN-IEC 61496-1 (2013)','Safety of machinery - Electro-sensitive protective equipment - Part 1: General requirements and tests'],
                                ['NPR-IEC/TR 61000-5-2 (2004)','Electromagnetic compatibility (EMC):<br>Part 5: Installation and mitigation guidelines<br>Section 2: Earthing and cabling'],
                                ['NPR-IEC/TR 61000-6-2 (2005)','Electromagnetic compatibility (EMC):<br>Part 6-2: Generic Standards - Immunity for industrial environments'],
                                ['NEN-EN-ISO 4414 (2010)','Pneumatic fluid power - General rules and safety requirements for systems and their components'],
                            ].map(([name,text])=>$('tr').append(
                                $('td').text(name),
                                $('td').html(text),
                            )),
                        ),
                        $('p').text('This In-mould labelling machine with Assembly (PLEA) is designed to insert a label into the mould and to take out the pails and handles from the mould area. After which the pails and handles are assembled and stacked.'),
                        $('p').text('The machine is design to work with an injection moulding machine type 820 H 3700-4600 Packaging from Arburg.'),
                        $('p').text('The security level of the control of this machine is designed as a PL = e, under the condition that the machine is assembled with the above injection molding machine.'),
                        $('p').text('The partly completed machine, to which this declaration refers, must not be put into operation until the final machine in which it will be incorporated or assembled is in accordance with the provisions of the Machinery Directive (2006/42 / EC) and a declaration of conformity (IIA statement) is signed.'),
                        $('p').text('We declare to provide the relevant technical documentation, on a reasoned request by the appropriate national authority. This is without prejudice to the intellectual property rights.'),
                        $('table').append(
                            $('tr').append(
                                $('th').text('Name'),
                                $('td').html('Polymac.b.v.'),
                            ),
                            $('tr').append(
                                $('th').text('Address'),
                                $('td').html('see address of the manufacturer'),
                            ),
                            $('tr').append(
                                $('th').text('Signed'),
                                $('td').html('Ede, 15 May 2024'),
                            ),
                            $('tr').append(
                                $('th').text('Signature'),
                                $('td').style('position:relative;height:18mm;').append(
                                    $('img').src('http://pol-dc01.polymac.intra/assets/image/max-van-kampen-signature.png').style('position:absolute;width:60mm;left:-13mm;top:-6mm;'),
                                ),
                            ),
                            $('tr').style('z-index:-1;').append(
                                $('th').text('Name and function undersigned'),
                                $('td').html('M.J. van Kampen<br><small>General Manager</small>'),
                            ),
                        ),
                    ));
                },
                async manual(){
                    const md1 = await fetch("assets/md/manual.md").then(e => e.text());
                    const project = await Aim.loadExcelSheet('/project/Ayva/P13544_P230518 PLEA 1-cav/Polymac-project-P230518.xlsx');
                    console.log({project});
                    const html = md1.render();
                    console.log(html);
                    return doc.body('User Manual for the PL (Polymac Label) machine', $('div').class('spec').append(
                        $('link').href("/postkantoor/App/pcm/assets/css/doc.css").rel("stylesheet"),
                        $('div').html(html),
                        (await doc.parts()),
                        (await doc.io()),
                    ));
                },
                async parts(){
                    const project = await Aim.loadExcelSheet('/project/Ayva/P13544_P230518 PLEA 1-cav/Polymac-project-P230518.xlsx');
                    const {partslist} = project;
                    function parttable(parts){
                        return $('table').class('grid').append(
                            $('thead').append(
                                $('tr').append(
                                    $('th').text('Quant'),
                                    $('th').text('Art.nr.'),
                                    $('th').text('Pos'),
                                    $('th').text('Description').style('width:100%;'),
                                    $('th').text('Spare'),
                                )
                            ),
                            $('tbody').append(
                                parts.map(row => row.unit).unique().map(unit => [
                                    $('tr').style('background-color:rgb(220,220,220);').append(
                                        $('td').colspan(5).text(unit),
                                    )
                                ].concat(partslist.filter(row => row.unit === unit).map(row => row.equipment).unique().map(equipment => [
                                    $('tr').style('background-color:rgb(240,240,240);').append(
                                        $('td').colspan(5).text(equipment),
                                    )
                                ].concat(partslist.filter(row => row.unit === unit && row.equipment === equipment).map(row => [
                                    $('tr').append(
                                        $('td').text(row.amount),
                                        $('td').text(row.articleNumber),
                                        $('td').text(row.pos),
                                        $('td').text(row.description),
                                        $('td').text(row.sparepart),
                                    )
                                ]))))),
                            ),
                        );
                    }
                    console.log({project});
                    return $('div').class('spec').append(
                        $('link').href("/postkantoor/App/pcm/assets/css/doc.css").rel("stylesheet"),
                        $('h1').text('Mechanical partslist'),
                        parttable(partslist.filter(row => row.type === 'Mechanical')),
                        $('h1').text('Electrical partslist'),
                        parttable(partslist.filter(row => row.type === 'Electrical')),
                    );
                },
                async io(){
                    const project = await Aim.loadExcelSheet('/project/Ayva/P13544_P230518 PLEA 1-cav/Polymac-project-P230518.xlsx');
                    console.log({project});
                    return $('div').class('spec').append(
                        $('link').href("/postkantoor/App/pcm/assets/css/doc.css").rel("stylesheet"),
                        $('h1').text('IO list'),
                        $('table').class('grid').append(
                            $('thead').append(
                                $('tr').append(
                                    $('th').text('Pin'),
                                    $('th').text('Id'),
                                    $('th').text('Description').style('width:100%;'),
                                    $('th').text('Remark'),
                                    $('th').text('Function'),
                                )
                            ),
                            $('tbody').append(
                                project.io.map(row => row.kaart).unique().map(kaart => [
                                    $('tr').style('background-color:rgb(220,220,220);').append(
                                        $('td').colspan(5).text(kaart),
                                    )
                                ].concat(project.io.filter(row => row.kaart === kaart).map(row => row.io).unique().map(io => [
                                    $('tr').style('background-color:rgb(240,240,240);').append(
                                        $('td').colspan(5).text(kaart,io),
                                    )
                                ].concat(project.io.filter(row => row.kaart === kaart && row.io === io).map(row => [
                                    $('tr').append(
                                        $('td').text(row.nr),
                                        $('td').text(row.id),
                                        $('td').text(row.nederlands),
                                        $('td').text(row.opmerking),
                                        $('td').text(row.functie),
                                    )
                                ]))))),
                            ),
                        ),
                    );
                },
                spec(selprops){
                    console.log({selprops});
                    return pm.letter({
                        title: 'Titel van document test 24',
                        company: 'Jansen en co',
                        content: $('div').append(
                            $('div').class('spec').append(
                                $('h1').text('Technical specifications').style('page-break-before:always;'),
                                legends.map(legend => {
                                    const selpropsForLegend = selprops.filter(([n, p]) => p.legend === legend);
                                    if (selpropsForLegend.length > 0) {
                                        return [
                                            $('h2').text(legend),
                                            $('table').class('grid').style('width:100%;').append(
                                                $('tbody').append(
                                                    selpropsForLegend.map(propcell)
                                                )
                                            )
                                        ];
                                    }
                                }),
                            ),
                        ),
                    });
                },
            }
    
            function propcell(entry){
                const [name,prop] = entry;
                if (row[name]) {
                const tr = $('tr').append(
                    $('th').text(prop.title || name).style('width:60mm;'),
                )
                if (prop.check) {
                    const [key, values] = Object.entries(prop.check[0])[0];
                    const selectedValue = row[key];
                    const shouldDisplay = values.includes(selectedValue);
                    if(!shouldDisplay){
                        return null;
                    }
                }
                const td = $('td').parent(tr);
                if (prop.options) {
                    const option = prop.options.find(o => o.value == row[name]) || {};
                    if (option.check) {
                        const [key, values] = Object.entries(option.check[0])[0];
                        const selectedValue = row[key];
                        const shouldDisplay = values.includes(selectedValue);
                        if(!shouldDisplay){
                            return null;
                        }
                    }
                    td.text(option.title || option.value, prop.unit);
                    if (option.description) {
                        $('div').parent(td).text(option.description);
                        }
                    if (option.image) {
                        $('img').parent(td).src('assets/image/'+option.image).style('display:block;max-height:60mm;');
                        }
                } else {
                    td.text(row[name], prop.unit);
                }
                return tr;
                }
            }
            $('div.spec').clear().append(
                $('nav').append(
                    $('button').text('Quote').on('click', e => doc.spec(props.filter(([n,p]) => !p.doctypes || p.doctypes.includes('quote'))).print()),
                    $('button').text('OK').on('click', e => doc.spec(props.filter(([n,p]) => !p.doctypes || p.doctypes.includes('ok'))).print()),
                    $('button').text('Manual').on('click', async e => (await doc.manual()).print()),
                    $('button').text('CE').on('click', async e => (await doc.ce()).print()),
                    $('button').text('Parts').on('click', async e => (await doc.parts()).print()),
                    $('button').text('IO').on('click', async e => (await doc.io()).print()),
                    $('button').text('Workmap').on('click', e=> {
                        window.open('http://pol-dc01.polymac.intra/postkantoor/App/pcm/doc-viewer.html');
                    })
                ),
                doc.spec(props),
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