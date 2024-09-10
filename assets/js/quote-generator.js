console.log('Quote-generator');
let pcmData = {};
let projectnr = {};
let totalPrice = 0;
window.addEventListener('load', async () => {
    const pcmuri = `https://aliconnect.nl/pagesgroup/api/index.php?json=pcm`;
    try {
        const pcm = await fetch('/api/docs/assets/yaml/pcm', { cache: "reload" }).then(e => e.json());
        await fetch(pcmuri, { method: 'POST', body: JSON.stringify(pcm) });
        pcmData = await fetch(pcmuri, { cache: "reload" }).then(e => e.json());
    } catch (error) {
        console.error('Error fetching PCM data:', error);
    }
    
    console.log(pcmData);
    const { properties } = pcmData.quote;

    function renderProjectForm() {
        $(document.body).clear().append(
            $('div').style('display:flex;height:100vh;').append(
                $('div').style('flex:1 0 auto;overflow:auto;padding:20px;').append(
                    $('form').id('project-form').append(
                        $('label').text('Enter Project Number: '),
                        $('input').type('text').id('project-number').name('project-number').required(true),
                        $('button').type('submit').text('Submit')
                    ),
                    $('div').id('quote-display').style('display:none;'),
                )
            )
        );
    }
    renderProjectForm();
    const projectForm = document.getElementById('project-form');
    const quoteDisplay = document.getElementById('quote-display');
    projectForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        projectnr = document.getElementById('project-number').value.trim();
        if (!projectnr) {
            alert('Please enter a project number.');
            return;
        }
        const dataurl = `https://aliconnect.nl/pagesgroup/api/index.php?json=${projectnr}`;
        try {
            let row = await fetch(dataurl).then(e => e.json());
            if (!row || Object.keys(row).length === 0) {
                row = {};
                
                await fetch(dataurl, { method: 'POST', body: JSON.stringify(pcmData) });
                alert('Project number does not exist. A new file has been created.');
            }
            quoteDisplay.style.display = 'block';
            buildPage(row, properties, dataurl);
            projectForm.style.display = 'none';
            await fetch(dataurl, { method: 'POST', body: JSON.stringify(row) });
        } catch (error) {
            console.error('Error fetching project data:', error);
            alert('An error occurred while retrieving the project data.');
        }
    });
    function buildPage(row, properties, dataurl) {
        $(document.body).clear().append(
            $('div').style('display:flex;height:100vh;').append(
                $('div').append(
                    $('h2').text('General configuration'),
                    buildGeneralForm(),
                    $('div').class('item-container').id('item-container')
                ),
                $('div').class('spec')
            )
        );
        function buildGeneralForm() {
            return $('form').class('general-form').style('flex:1 0 auto;overflow:auto;')
                .properties({ row, properties }, true)
                .on('change', e => {
                    const data = Object.fromEntries(new FormData(e.target.form));
                    if (e.target.name === 'products') {
                        const newProductCount = parseInt(data.products, 10);
                        data.item = row.item
                        updateProductForms(newProductCount);
                    }
                    console.log('Updating project data', { data });
                    fetch(dataurl, { method: 'POST', body: JSON.stringify(data) });
                    build();
                });
        }
        function buildItemForm(productNumber) {
            
            return $('form').class('item-form').style('flex:1 0 auto;overflow:auto;').append(
                $('h2').text(`Item ${productNumber} configuration`)
            );
        }
    
        function renderItemForms(productCount) {
            const itemProperties = pcmData.item;
            console.log(itemProperties);
            const itemContainer = $('#item-container');
            itemContainer.clear();
            for (let i = 1; i <= productCount; i++) {
                itemContainer.append(buildItemForm(i), itemProperties);
            }
        }
        renderItemForms(row.products);
        function updateProductForms(newProductCount) {
            row.products = newProductCount;
            for (let i = 1; i <= newProductCount; i++) {
                if (!row.item[i]) {
                    row.item[i] = {};
                }
            }
            renderItemForms(newProductCount);
        }
        function build() {
            const props = Object.entries(properties);
            const legendsForItems = ['Item'];
            const legendsForSpecs = [...new Set(
                props.map(([n, p]) => p.legend)
            )].filter(legend => 
                legend !== "Item" && props.some(([n, p]) => p.legend === legend)
            );
            const doc = {
                body(title) {
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
                    );
                },
                spec(selprops){
                    totalPrice = 0;
                    const quoteText = generateQuoteText(row, pcmData);
                    return $('div').append(
                        $('link').href("/postkantoor/App/pcm/assets/css/doc.css").rel("stylesheet"),
                        $('table').style('width:100%;table-layout:fixed;').append(
                            $('thead').append(
                                $('tr').append(
                                    $('td').colspan(2).style('padding:0 0 0 10mm;').append(
                                        $('table').style('width:100%;table-layout:fixed;margin:0;').append(
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
                                        $('table').style('width:100%;table-layout:fixed;margin:0;').append(
                                            $('tbody').append(
                                                $('tr').append(
                                                    $('td').style('vertical-align:middle;padding:0;').append(
                                                        $('div').text(row.companyName || 'Default company').style('font-weight:bold;'),
                                                        $('div').text(row.companyStreetAdress || 'Street Address'),
                                                        $('div').text(row.companyZipCode + ', ' + row.companyCity || 'ZipCode, City'),
                                                        $('div').text(row.companyCountry || 'Country'),
                                                    ),
                                                    $('td').style('width:50mm;font-size:9pt;padding:0;').append(
                                                        $('div').text('Polymac B.V.').style('font-weight:bold;margin-bottom:5px;'),
                                                        $('div').text('Morsestraat 20, 6716 AH Ede'),
                                                        $('div').text('P.O. Box 552, 6710 BN Ede'),
                                                        $('div').text('The Netherlands').style('margin-bottom:5px;'),
                                                        $('div').text('E info@polymac.pagesgroup.nl'),
                                                        $('div').text('I www.pagesgroup.nl'),
                                                        $('div').text('T +31 (0)318 648 600'),
                                                        $('div').text('F +31 (0)318 648 610'),
                                                        $('div').text('KvK Arnhem 09044682'),
                                                    ),
                                                ),
                                            ),
                                        ),
                                        $('table').style('width:100%;margin:20px 0;').append(
                                            $('tbody').append(
                                                $('tr').append(
                                                    $('th').text('Title:').style('width:100%;'),
                                                    $('th').style('min-width:50mm;').text('Date:'),
                                                ),
                                                $('tr').append(
                                                    $('td').style('width:100%;').text('Quotation'),
                                                    $('td').style('min-width:50mm;').text(new Date().toLocaleDateString()),
                                                ),
                                                $('tr').append(
                                                    $('th').style('width:100%;').text('Subject:'),
                                                    $('th').style('min-width:50mm;').text('Our reference:'),
                                                ),
                                                $('tr').append(
                                                    $('td').style('width:100%;').text(quoteText.subject),
                                                    $('td').style('min-width:50mm;').text(projectnr || 'Default nr.'),
                                                ),
                                            ),
                                        ),
                                        $('p').text('Dear ' + row.companyContactPerson + ','),
                                        $('p').text(quoteText.text),
                                        $('p').text('We trust that our offer is in full compliance with your specifications and we look forward to hearing from you soon.'),
                                        $('p').text('Sincerely Yours,'),
                                        $('p').text('Polymac b.v.'),
                                        $('p').html('Peter Alink<br><small>Director of Sales</small>'),

                                        $('div').class('Items').append(
                                            $('h1').text('Item specifications').style('page-break-before:always;'),
                                            legendsForItems.map(legend => {
                                            }),    
                                        ),

                                        $('div').class('spec').append(
                                            $('h1').text('Order specifications').style('page-break-before:always;'),
                                            legendsForSpecs.map(legend => {
                                                const selpropsForLegend = selprops.filter(([n, p]) => p.legend === legend && row[n]);
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
                                        $('div').class('price').append(
                                            $('h1').text('Pricing details').style('page-break-before:always;'),
                                            $('table').style('font-weight:bold;').append(
                                                $('thead').append(
                                                    $('tr').append(
                                                        $('td').text('Item').style('width:60mm;font-weight:bold;'),
                                                        $('td').text('Option').style('width:60mm;font-weight:bold;'),
                                                        $('td').text('Price (in Euro)').style('text-align:right;font-weight:bold;'),
                                                    ),
                                                ),
                                                $('tbody').append(
                                                    selprops.map(pricecell).filter(row => row),
                                                ),
                                                $('tfoot').append(
                                                    $('tr').append(
                                                        $('td').text('Total').style('font-weight:bold;'),
                                                        $('td').text(' '),
                                                        $('td').text(totalPrice.toFixed(2)).style('text-align:right;font-weight:bold;'),
                                                    )
                                                ),
                                            )
                                        ),
                                    ),
                                ),
                            ),
                            $('tfoot').append(
                                $('tr').append(
                                    $('td').colspan(2).style('height:15mm;').append(
                                        $('table').style('position:fixed;bottom:0;width:100%;table-layout:fixed;margin:0;').append(
                                            $('tbody').append(
                                                $('tr').append(
                                                    $('td').text(quoteText.subject).style('width:50mm;'),
                                                )
                                            )
                                        )
                                    )
                                )
                            ),
                        ),
                    );
                },
                async aboutUs(){
                    const aboutUsMd = await fetch("assets/md/quoteAboutUs.md").then(e => e.text());
                    const aboutUsHtml = aboutUsMd.render();
                    return $('div').class('aboutUs').append(
                        $('link').href("/postkantoor/App/pcm/assets/css/doc.css").rel("stylesheet"),
                        $('div').html(aboutUsHtml),
                    );
                },
                async COS(){
                    const COSMd = await fetch("assets/md/quoteCOS.md").then(e => e.text());
                    const COSHtml = COSMd.render();
                    return $('div').class('cos').append(
                        $('link').href("/postkantoor/App/pcm/assets/css/doc.css").rel("stylesheet"),
                        $('div').html(COSHtml),
                    );
                },
            }
            async function generateCombinedQuote() {
                const specContent = await doc.spec(props.filter(([n,p]) => !p.doctypes || p.doctypes.includes('quote')));
                const aboutUsContent = await doc.aboutUs();
                const cosContent = await doc.COS();
                return $('div').append(
                    specContent,
                    aboutUsContent,
                    cosContent
                );
            }
            console.log(row);
            function propcell(entry) {
                const [name, prop] = entry;
                if (row[name]) {
                    const tr = $('tr').append(
                        $('th').text(prop.title || name).style('width:60mm;'),
                    )
                    if (prop.check) {
                        const [key, values] = Object.entries(prop.check[0])[0];
                        const selectedValue = row[key];
                        const shouldDisplay = values.includes(selectedValue);
                        if (!shouldDisplay) {
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
                            if (!shouldDisplay) {
                                return null;
                            }
                        }
                        td.text(option.title || option.value, prop.unit);
                        if (option.description) {
                            $('div').parent(td).text(option.description);
                        }
                        if (option.image) {
                            $('img').parent(td).src('assets/image/' + option.image).style('display:block;max-height:60mm;');
                        }
                    } else {
                        td.text(row[name], prop.unit);
                    }
                    return tr;
                }
            }
            function pricecell(entry) {   
                const [name, prop] = entry;
                if (row[name]) {
                    const selectedOption = prop.options ? prop.options.find(o => o.value == row[name]) : null;
                    if (selectedOption && selectedOption.price) {
                        const optionPrice = parseFloat(selectedOption.price);
                        const tr = $('tr').append(
                            $('td').text(prop.title),
                            $('td').text(selectedOption.title || name),
                            $('td').text(optionPrice.toFixed(2)).style('text-align:right;'),
                        );
                        totalPrice = totalPrice + optionPrice;
                        return tr
                    }
                }
                return null;
            }
            $('div.spec').append(
                $('nav').append(
                    $('button').text('Custom content').on('click', e => doc.spec(props.filter(([n,p]) => !p.doctypes || p.doctypes.includes('quote'))).print()),
                    $('button').text('About Us').on('click', async e => (await doc.aboutUs()).print()),
                    $('button').text('Cos').on('click', async e => (await doc.COS()).print()),
                    $('button').text('Generate Quote').on('click', async e => {
                        const combinedQuote = await generateCombinedQuote();
                        combinedQuote.print();
                    }),
                    $('button').text('Back').on('click', () => {
                        renderProjectForm();
                    }),
                ),
                doc.spec(props),
            );
        }
        build();
    }
    function generateQuoteText(row, properties) {
        const { machine, model } = row;
        const getOptionTitle = (options, value) =>
            options.find(option => option.value === value)?.title || value;
        const machineTitle = getOptionTitle(properties.quote.properties.machine.options, machine);
        const modelTitle = getOptionTitle(properties.quote.properties.model.options, model);
        return {
            subject: `Quote for ${machineTitle} ${modelTitle} machine`,
            text: `With reference to your inquiry, we have pleasure submitting our quotation for a ${machineTitle} ${modelTitle} machine. We have based our offer on the specification received.`,
        };
    }
});