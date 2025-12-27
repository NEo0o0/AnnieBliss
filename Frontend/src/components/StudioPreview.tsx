import Masonry, { ResponsiveMasonry } from 'react-responsive-masonry';

const studioImages = [
  {
    url: 'https://images.unsplash.com/photo-1599447421376-611783057464?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5b2dhJTIwc3R1ZGlvJTIwaW50ZXJpb3J8ZW58MXx8fHwxNzY2NDkxMTAxfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    alt: 'Yoga studio interior',
  },
  {
    url: 'https://images.unsplash.com/photo-1758599880235-b870108f2b8b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5b2dhJTIwbWF0JTIwcGVhY2VmdWx8ZW58MXx8fHwxNzY2NDkxMTAyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    alt: 'Peaceful yoga mat',
  },
  {
    url: 'https://images.unsplash.com/photo-1602075912643-3c2297caf15e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5b2dhJTIwcGxhbnRzJTIwbmF0dXJhbHxlbnwxfHx8fDE3NjY0OTExMDJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    alt: 'Natural yoga space with plants',
  },
  {
    url: 'https://images.unsplash.com/photo-1764334048870-6196dd773fe4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZWRpdGF0aW9uJTIwc3BhY2UlMjB6ZW58ZW58MXx8fHwxNzY2NDkxMTAyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    alt: 'Meditation space zen',
  },
  {
    url: 'https://images.unsplash.com/photo-1671581085011-3cb155126537?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5b2dhJTIwZXF1aXBtZW50JTIwc3R1ZGlvfGVufDF8fHx8MTc2NjQ5MTEwM3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    alt: 'Yoga equipment and studio',
  },
];

export function StudioPreview() {
  return (
    <section className="py-20 px-6 bg-[var(--color-cream)]">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-center mb-4 text-[var(--color-earth-dark)]">Our Studio</h2>
        <p className="text-center text-[var(--color-stone)] mb-16 max-w-2xl mx-auto">
          A peaceful sanctuary where natural light, calming textures, and mindful design create the perfect environment for your practice.
        </p>

        <ResponsiveMasonry columnsCountBreakPoints={{ 350: 1, 768: 2, 1024: 3 }}>
          <Masonry gutter="1rem">
            {studioImages.map((image, index) => (
              <div key={index} className="overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300">
                <img
                  src={image.url}
                  alt={image.alt}
                  className="w-full h-auto object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
            ))}
          </Masonry>
        </ResponsiveMasonry>
      </div>
    </section>
  );
}
