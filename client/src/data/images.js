// Nail Design Gallery Images
import img1  from '../images/images1.jpg';
import img2  from '../images/images2.jpg';
import img3  from '../images/images3.jpg';
import img4  from '../images/images4.jpg';
import img5  from '../images/images5.jpg';
import img6  from '../images/images6.jpg';
import img7  from '../images/images7.jpg';
import img8  from '../images/images8.jpg';
import img9  from '../images/images9.jpg';
import img10 from '../images/images10.jpg';
import img11 from '../images/images11.jpg';
import img12 from '../images/images12.jpg';
import img13 from '../images/images13.jpg';
import img14 from '../images/images14.jpg';
import img15 from '../images/images15.jpg';
import img16 from '../images/images16.jpg';

// Team Images
import img18 from '../images/images18.jpg';
import img19 from '../images/images19.jpg';

// Service Images
import imgManicure      from '../images/manicure.jpg';
import imgNailDesign    from '../images/nail_design.jpg';
import imgPedicure      from '../images/Pedicure.jpg';
import imgNailArt       from '../images/nailArt.jpg';
import imgNailGel       from '../images/NailGel.jpg';
import imgNailCare      from '../images/nail_care.jpg';
import imgNailExtension from '../images/NailExtension.jpg';
import imgLash          from '../images/lash.jpg';
import imgFootSpa       from '../images/foot_spa.jpg';

// Nail Design Gallery array
export const nailDesignImages = [
  { id: 1,  src: img1,  alt: 'Nail Design 1' },
  { id: 2,  src: img2,  alt: 'Nail Design 2' },
  { id: 3,  src: img3,  alt: 'Nail Design 3' },
  { id: 4,  src: img4,  alt: 'Nail Design 4' },
  { id: 5,  src: img5,  alt: 'Nail Design 5' },
  { id: 6,  src: img6,  alt: 'Nail Design 6' },
  { id: 7,  src: img7,  alt: 'Nail Design 7' },
  { id: 8,  src: img8,  alt: 'Nail Design 8' },
  { id: 9,  src: img9,  alt: 'Nail Design 9' },
  { id: 10, src: img10, alt: 'Nail Design 10' },
  { id: 11, src: img11, alt: 'Nail Design 11' },
  { id: 12, src: img12, alt: 'Nail Design 12' },
  { id: 13, src: img13, alt: 'Nail Design 13' },
  { id: 14, src: img14, alt: 'Nail Design 14' },
  { id: 15, src: img15, alt: 'Nail Design 15' },
  { id: 16, src: img16, alt: 'Nail Design 16' },
];

// Team Preview data
export const teamPreview = [
  {
    name:        'Rose',
    role:        'Senior Nail & Beauty Specialist',
    rating:      4.8,
    reviews:     245,
    image:       img18,
    specialties: ['Nail Design', 'Gel Nails', 'Lash Extension', 'Waxing'],
  },
  {
    name:        'Pangging',
    role:        'Beauty & Spa Specialist',
    rating:      4.9,
    reviews:     280,
    image:       img19,
    specialties: ['Pedicure', 'Lash Firm', 'Foot Spa', 'Complete Care'],
  },
];

// Service Cards data
export const serviceCards = [
  { icon: '', title: 'Nail Design',     description: 'Beautiful custom nail art designs',     image: imgNailDesign    },
  { icon: '', title: 'Manicure',        description: 'Professional manicure services',         image: imgManicure      },
  { icon: '', title: 'Pedicure',        description: 'Relaxing pedicure treatment',            image: imgPedicure      },
  { icon: '', title: 'Nail Art',        description: 'Creative and trendy nail designs',       image: imgNailArt       },
  { icon: '', title: 'Gel Nails',       description: 'Long-lasting gel nail polish',           image: imgNailGel       },
  { icon: '', title: 'Nail Care',       description: 'Health and maintenance services',        image: imgNailCare      },
  { icon: '', title: 'Nail Extensions', description: 'Beautiful nail length and shape',        image: imgNailExtension },
  { icon: '', title: 'Lash Services',   description: 'Extensions and lash lift treatments',    image: imgLash          },
  { icon: '', title: 'Foot Spa',        description: 'Full relaxing foot spa experience',      image: imgFootSpa       },
];
