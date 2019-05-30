String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.split(search).join(replacement);
};

function convertIGC(igc, name) {
    
    let result = IGCParser.parse(igc);
    console.log(result);
    const coordinates = [];
    for (let c of result.fixes) {
        coordinates.push(coordinatesTemplate.
            replaceAll('{{lon}}', c.longitude.toString()).
            replaceAll('{{lat}}', c.latitude.toString()).
            replaceAll('{{alt}}', (c.gpsAltitude||0).toString()).
            replaceAll('{{time}}', new Date(c.timestamp).toISOString())
        )
    }
    const color = '#FF' + (function co(lor){   return (lor +=[0,1,2,3,4,5,6,7,8,9,'a','b','c','d','e','f'][Math.floor(Math.random()*16)]) && (lor.length == 6) ?  lor : co(lor); })('');
      
    const icon = icons[Math.floor(Math.random() * icons.length)];
    
    

    return documentTemplate.replace('{{color}}', color).replace('{{icon}}', icon).replaceAll('{{name}}', result.pilot||name.replace('.igc', '')).replaceAll('{{coordinates}}', coordinates.join(''));

}


const icons = [
    "http://maps.google.com/mapfiles/kml/pushpin/blue-pushpin.png",
    "http://maps.google.com/mapfiles/kml/pushpin/grn-pushpin.png",
    "http://maps.google.com/mapfiles/kml/pushpin/ltblu-pushpin.png",
    "http://maps.google.com/mapfiles/kml/pushpin/pink-pushpin.png",
    "http://maps.google.com/mapfiles/kml/pushpin/purple-pushpin.png",
    "http://maps.google.com/mapfiles/kml/pushpin/red-pushpin.png",
    "http://maps.google.com/mapfiles/kml/pushpin/wht-pushpin.png",
    "http://maps.google.com/mapfiles/kml/pushpin/ylw-pushpin.png"
]

const coordinatesTemplate = `
      <gx:coord>{{lon}} {{lat}} {{alt}}</gx:coord>
      <when>{{time}}</when>`;

const documentTemplate = `
<Document xmlns:atom="http://www.w3.org/2005/Atom" xmlns:gx="http://www.google.com/kml/ext/2.2" xmlns="http://www.opengis.net/kml/2.2">
  <name>{{name}}</name>
  <Placemark>
    <name>{{name}}</name>
    <Style>
      <LineStyle>
        <color>{{color}}</color>
        <width>2</width>
      </LineStyle>
      <IconStyle>
        <Icon>
            <href>{{icon}}</href>
        </Icon>
        </IconStyle>
    </Style>
    <gx:Track>
        <extrude>0</extrude>
        <gx:altitudeMode>absolute</gx:altitudeMode>
        {{coordinates}}
    </gx:Track>
  </Placemark>
</Document>`;