import { Metadata } from "next";
import BottomNav from "@/components/BottomNav";
import PageHeader from "@/components/PageHeader";
import BackgroundImage from "@/components/BackgroundImage";
import CopyBioButtons from "@/components/CopyBioButtons";
import ImageGrid from "@/components/ImageGrid";
import { LINKS } from "@/constants/links";

export const metadata: Metadata = {
  title: "Biography - Electronic Music Producer & DJ from Idaho",
  description: "Learn about Kissay - Northwest electronic music producer, DJ, and Konnexion Music Festival curator. Experience in stage design, label management, talent buying, and festival organizing across Idaho and the Pacific Northwest.",
  openGraph: {
    title: "Biography - Kissay | Electronic Music Producer & DJ from Idaho",
    description: "Learn about Kissay - Northwest electronic music producer, DJ, and Konnexion Music Festival curator. Multi-genre bass music selectah from Idaho.",
    images: ["/kissay_social_share.webp"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Biography - Kissay | Electronic Music Producer & DJ from Idaho",
    description: "Learn about Kissay - Northwest electronic music producer, DJ, and Konnexion Music Festival curator.",
    images: ["/kissay_social_share.webp"],
  },
};

// Bio content constants - update here to change all instances
const BIO_CONTENT = {
  tagline: "all-star artistry meets an experimental edge",

  paragraphs: [
    "Music may sometimes speak for itself, but why not ask for more? It is exactly this craving for more that causes Kissay to flex a multimedia machine gun of talents. Not many artists from the Northwest already have experience in stage design, label management, talent buying, festival organizing, fashion, web development, graphic design, music production and premier DJ-ing. Without a doubt, Kissay has stepped up to the electronic music scene with a vision, ready to contribute.",

    "Musically, it is difficult for genre classifications to contain him. Sure, he often plays with broken beats and heavy low-end textures, teasing between bass subgenres like a world-class selectah but Kissay also has deep roots in both house and techno. The stylistic constant seems to be that of innovation, experimentation, and emotional exploration. Kissay regularly flirts with deconstructed melodic minimalism to evoke an intimate yet alien emotiveness. Using lush snaps, crackles, and pops, his rhythms are a pleasant textural experience.",

    "It would be easy to classify him as left-field, but he's also right-field, first-baseman, pitcher... He is clearly inspired by Yuku, Cosmic Bridge, and Terrorhythm at the very core, but seems to find his truest inspiration from those underground labels you've never heard of – from those who are fashioning a new niche within global culture. Trendsetting saturates his bloodstream.",

    "Never expect his releases to replicate. They will constantly be a reflection of his forward-leaning perspectives. The Kissay of today will look nothing like the Kissay of next year, but you will recognize him in his passion for experimentation, for connecting the dots between the disparate genres and artistic mediums that for too long have remained ostracized from each other.",

    "Kissay's musical vision is refreshing. Few artists are able to achieve such a venerated status within a community while constantly challenging its comfort-zone. Kissay has led by example on how to act with authenticity and integrity in the music industry. As an individual, his personality immediately impresses with kindness, and professionalism. So, when Kissay says that his artistry is only a means to amplify his personality, we know we're in for a truly valuable experience.",

    "Kissay has performed at festivals across the West Coast including: Emissions West Coast Bass Culture, The Pirate Party, Treefort Music Fest, Lost River Disco, Konnexion Music Festival, Galactivate Campout. Kissay has been able to provide support to artists including: The Glitch Mob, Anna Morgan, Of The Trees, Detox Unit, Ternion Sound, Fly, Gladkill, Starkey, ill-esha, Shay De Castro, Hyroglifics, Succubass, and countless others across the past decade of performances. ",
  ],

  // Generated from constants
  get full() {
    return `${
      this.tagline.charAt(0).toUpperCase() + this.tagline.slice(1)
    }. ${this.paragraphs.join("\n\n")}`;
  },

  get short() {
    return `${
      this.tagline.charAt(0).toUpperCase() + this.tagline.slice(1)
    }. A driving force behind the NW electronic music scene, Kissay is more than just a dj or producer. As the co-owner, artistic director, and music curator of Konnexion Music Festival, Kissay has led by example on how to act with authenticity and integrity in the music industry. As a selectah, Kissay champions multi-genre broken beats and heavy low-end textures, but he also has deep roots in both house and techno. His productions flirt with deconstructed club and a melodic minimalism to evoke an intimate yet alien emotiveness. Combining his multimedia skill set, Kissay intends to redefine the contemporary categorizations of electronic music and the culture that surrounds it. Kissay is an example of the refreshing step forward that the underground scene can take in the upcoming generation.`;
  },
};

export default function Biography() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <BackgroundImage />

      <PageHeader title="Biography" />

      <main className="relative max-w-4xl mx-auto px-6 pb-32">
        <div className="space-y-16">
          {/* Bio Content - Editorial Layout */}
          <div className="space-y-8 text-white">
            {/* Tagline - Large Editorial Style */}
            <div className="border-l-4 border-white/20 pl-6">
              <p className="text-display text-heading-lg text-white/90 italic lowercase leading-tight">
                {BIO_CONTENT.tagline}
              </p>
            </div>

            {/* Bio Paragraphs - Editorial Typography */}
            <div className="space-y-6">
              {BIO_CONTENT.paragraphs.map((paragraph, index) => (
                <p
                  key={index}
                  className="text-body-lg leading-relaxed text-white/90"
                >
                  {paragraph}
                </p>
              ))}
            </div>
          </div>

          {/* Copy Bio Section - Editorial Design */}
          <div className="space-y-8">
            <div className="border-t border-white/20 pt-8">
              <h2 className="text-display text-heading-md text-white mb-4">
                Press Kit
              </h2>
              <p className="text-body-lg text-white/80">
                Need bio text for your website or press release? Copy the
                formatted version below.
              </p>
            </div>

            <div className="space-y-4">
              {/* Copy Bio Buttons - Client Component */}
              <CopyBioButtons
                fullBio={BIO_CONTENT.full}
                shortBio={BIO_CONTENT.short}
              />

              {/* Full Press Kit Button */}
              <a
                href={LINKS.pressKit}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full px-8 py-4 bg-white text-black rounded-2xl font-semibold hover:bg-white/90 transition-all duration-200 hover:scale-[1.02] active:scale-95 text-center text-body"
              >
                View Full Press Kit
              </a>
            </div>
          </div>

          {/* Image Grid */}
          <ImageGrid />
        </div>
      </main>
      <BottomNav />
    </div>
  );
}
