Object.assign(pm, {
  _letter(title, content) {
    return $('div').class('spec').style('max-width:18cm;margin:0 auto;').append(
      // $('link').href("/postkantoor/App/pcm/assets/css/doc.css").rel("stylesheet"),
      $('link').href("https://aliconnect.nl/sdk-1.0.0/lib/aim/font/AliconnectIcons.css").rel("stylesheet"),
      // $('link').href("https://aliconnect.nl/sdk-1.0.0/lib/aim/css/print.css").rel("stylesheet"),
      $('table').style('width:100%;table-layout:fixed;').append(
        $('thead').append(
          $('tr').append(
            $('td').colspan(2).style('padding:0 0 0 10mm;').append(
              $('table').style('width:100%;table-layout:fixed;margin:0 0 5mm 0;').append(
                $('tbody').append(
                  $('tr').append(
                    $('td').append($('img').src('https://aliconnect.nl/pagesgroup/polymac/assets/image/logo-pages.png').style('height:8mm;')),
                    $('td').append($('img').src('https://aliconnect.nl/pagesgroup/polymac/assets/image/logo-polymac.jpg').style('height:8mm;')).style('width:50mm;'),
                  ),
                ),
              ),
            ),
          ),
        ),
        // sdfgadg
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
                  ),
                ),
              ),
            ),
          ),
        ),
      ),
    );
  },  
  quote() {

  },
})