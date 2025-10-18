export default function StructuredData() {
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "MusicGroup",
        "@id": "https://kissaymusic.com/#artist",
        "name": "Kissay",
        "alternateName": "Kissay Music",
        "url": "https://kissaymusic.com",
        "image": "https://kissaymusic.com/kissay_social_share.webp",
        "description": "Electronic music producer, DJ, and festival curator from Idaho. Specializing in dubstep, drum & bass, club, global beats, and wave music.",
        "genre": [
          "Electronic Music",
          "Dubstep",
          "Drum and Bass",
          "Bass Music",
          "Club Music",
          "Wave Music",
          "Global Beats",
          "Experimental Electronic",
          "Deconstructed Club"
        ],
        "sameAs": [
          "https://open.spotify.com/artist/6n9ONhGaJyjOZgGjgmEDCm",
          "https://soundcloud.com/kissaymusic",
          "https://www.instagram.com/kissaymusic/",
          "https://www.facebook.com/kissaymusic/",
          "https://kissaymusic.bandcamp.com/",
          "https://music.apple.com/us/artist/kissay/1496906650"
        ],
        "address": {
          "@type": "PostalAddress",
          "addressLocality": "Idaho",
          "addressRegion": "ID",
          "addressCountry": "US"
        },
        "areaServed": {
          "@type": "Place",
          "name": "Pacific Northwest",
          "address": {
            "@type": "PostalAddress",
            "addressRegion": ["ID", "WA", "OR"],
            "addressCountry": "US"
          }
        }
      },
      {
        "@type": "Person",
        "@id": "https://kissaymusic.com/#person",
        "name": "Kissay",
        "jobTitle": [
          "Electronic Music Producer",
          "DJ",
          "Music Festival Curator",
          "Artistic Director"
        ],
        "description": "Multi-talented electronic music artist from Idaho with experience in stage design, label management, talent buying, festival organizing, and music production.",
        "url": "https://kissaymusic.com",
        "image": "https://kissaymusic.com/kissay_social_share.webp",
        "sameAs": [
          "https://open.spotify.com/artist/6n9ONhGaJyjOZgGjgmEDCm",
          "https://soundcloud.com/kissaymusic",
          "https://www.instagram.com/kissaymusic/",
          "https://www.facebook.com/kissaymusic/"
        ],
        "knowsAbout": [
          "Music Production",
          "DJing",
          "Festival Organization",
          "Stage Design",
          "Label Management",
          "Talent Buying",
          "Electronic Music",
          "Bass Music",
          "Dubstep",
          "Drum and Bass"
        ],
        "hasOccupation": {
          "@type": "Occupation",
          "name": "Music Producer & DJ",
          "occupationLocation": {
            "@type": "City",
            "name": "Idaho"
          }
        }
      },
      {
        "@type": "WebSite",
        "@id": "https://kissaymusic.com/#website",
        "url": "https://kissaymusic.com",
        "name": "Kissay Music",
        "description": "Official website of Kissay - Electronic music producer and DJ",
        "publisher": {
          "@id": "https://kissaymusic.com/#artist"
        },
        "inLanguage": "en-US"
      },
      {
        "@type": "Organization",
        "name": "Konnexion Music Festival",
        "url": "https://kissaymusic.com",
        "founder": {
          "@id": "https://kissaymusic.com/#person"
        },
        "description": "Music festival in the Pacific Northwest co-owned and curated by Kissay"
      }
    ]
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}
