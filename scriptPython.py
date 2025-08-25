import requests
import xml.etree.ElementTree as ET

url = "https://eccharts.ecmwf.int/wms/?token=public&request=GetCapabilities&version=1.3.0"

response = requests.get(url)
xml_content = response.content

root = ET.fromstring(xml_content)

ns = {'wms': 'http://www.opengis.net/wms'}

layers = root.findall('.//wms:Layer/wms:Layer', ns)

print(f"Found {len(layers)} layers:\n")

for layer in layers:
    name = layer.find('wms:Name', ns)
    title = layer.find('wms:Title', ns)
    units = layer.find('wms:Units', ns)
    dimension = layer.find("wms:Dimension[@name='time']", ns)

    print("Layer:")
    print(f"  Name:   {name.text if name is not None else 'N/A'}")
    print(f"  Title:  {title.text if title is not None else 'N/A'}")
    print(f"  Units:  {units.text if units is not None else 'N/A'}")
    print(f"  Time:   {dimension.text[:50] + '...'}" if dimension is not None else "  Time:   N/A")
    print("-" * 40)
