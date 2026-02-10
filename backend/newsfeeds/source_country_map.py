# newsfeeds/source_country_map.py

# Mapping of countries to their news sources
SOURCE_COUNTRY_MAP = {
    # North Africa
    "Algeria": [],
    "Egypt": [],
    "Libya": [],
    "Morocco": [],
    "Sudan": [],
    "Tunisia": [],
    "Western Sahara": [],  # disputed territory

    # West Africa
    "Benin": [],
    "Burkina Faso": [],
    "Cabo Verde": [],
    "Côte d’Ivoire": [],
    "Gambia": ['The Standard', 'The Point', 'FatuNetwork'],
    "Ghana": ["Modern Ghana", "MyJoyOnline", "GH Headlines"],
    "Guinea": [],
    "Guinea-Bissau": [],
    "Liberia": ["AllAfrica Liberia"],
    "Mali": ['MaliWeb',"L'Express du Mali", "Bamada"],
    "Mauritania": ['Kassataya', 'Le Calame', 'Tawary'],
    "Niger": ['NigerExpress', 'Le Sahel', 'AirInfoAgadez'],
    "Nigeria": ["Vanguard", "Premium Times", "The Guardian", "Channels TV"],
    "Senegal": ['Dakaractu', 'Thiesinfo', 'TerangaTimesN'],
    "Sierra Leone": ['Cocorioko', 'The Calabash Newspaper', 'CritiqueEcho'],
    "Togo": ['iciLome', 'LomeInfos'],

    # Central Africa
    "Cameroon": [],
    "Central African Republic": [],
    "Chad": [],
    "Congo": [],                      # Republic of the Congo
    "Democratic Republic of the Congo": [],
    "Equatorial Guinea": [],
    "Gabon": [],
    "São Tomé and Príncipe": [],

    # East Africa
    "Burundi": [],
    "Comoros": [],
    "Djibouti": [],
    "Eritrea": [],
    "Ethiopia": [],
    "Kenya": ["Daily Nation", "The Standard"],
    "Madagascar": [],
    "Malawi": [],
    "Mauritius": [],
    "Mozambique": [],
    "Rwanda": [],
    "Seychelles": [],
    "Somalia": [],
    "South Sudan": [],
    "Tanzania": [],
    "Uganda": [],
    "Zambia": [],
    "Zimbabwe": [],

    # Southern Africa
    "Botswana": [],
    "Eswatini": [],
    "Lesotho": [],
    "Namibia": [],
    "South Africa": [],
}


def get_country_by_source(source_name):
    """
    Returns a Country object based on the news source.
    If no match is found, returns None.
    """
    # Import inside the function to avoid circular import
    from .models import Country

    for country_name, sources in SOURCE_COUNTRY_MAP.items():
        if source_name in sources:
            return Country.objects.filter(name__iexact=country_name).first()
    return None
