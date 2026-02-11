// Sample graphics card data to seed the database
// Run this script after setting up your DynamoDB table

const sampleProducts = [
  {
    id: 'rtx-4090',
    name: 'NVIDIA RTX 4090',
    price: 1599,
    state: 'available',
    description:
      'Ultimate gaming GPU with incredible performance for 4K gaming and content creation.',
    specs: {},
    images: [
      'https://images.unsplash.com/photo-1587829191301-b591df5ed71f?w=500&h=500&fit=crop',
      'https://images.unsplash.com/photo-1599163778033-c0ae59bc7b7e?w=500&h=500&fit=crop',
    ],
  },
  {
    id: 'rtx-4080',
    name: 'NVIDIA RTX 4080',
    price: 1199,
    state: 'available',
    description: 'High-performance GPU for 4K gaming and professional workloads.',
    specs: {},
    images: [
      'https://images.unsplash.com/photo-1620704304736-ba21979e0b5e?w=500&h=500&fit=crop',
      'https://images.unsplash.com/photo-1618604572192-c06575e1e397?w=500&h=500&fit=crop',
    ],
  },
  {
    id: 'rtx-4070',
    name: 'NVIDIA RTX 4070',
    price: 599,
    state: 'available',
    description:
      'Excellent mid-range GPU for 1440p gaming at high settings and stream production.',
    specs: {},
    images: [
      'https://images.unsplash.com/photo-1550009158-9ebf69bb2ebb?w=500&h=500&fit=crop',
    ],
  },
  {
    id: 'rtx-4060',
    name: 'NVIDIA RTX 4060',
    price: 299,
    state: 'available',
    description: 'Entry-level GPU perfect for 1080p gaming and everyday computing.',
    specs: {},
    images: [
      'https://images.unsplash.com/photo-1591290621586-c1fb9a57c1f4?w=500&h=500&fit=crop',
    ],
  },
  {
    id: 'rtx-4090-super',
    name: 'NVIDIA RTX 4090 Super',
    price: 1799,
    state: 'out-of-stock',
    description: 'Next-gen flagship with enhanced performance and efficiency.',
    specs: {},
    images: [
      'https://images.unsplash.com/photo-1622185713635-7d3b59b7e3c2?w=500&h=500&fit=crop',
    ],
  },
  {
    id: 'amd-radeon-7900xtx',
    name: 'AMD Radeon RX 7900 XTX',
    price: 899,
    state: 'available',
    description: 'Powerful RDNA 3 GPU delivering excellent 4K gaming performance.',
    specs: {},
    images: [
      'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=500&h=500&fit=crop',
    ],
  },
]

module.exports = sampleProducts
