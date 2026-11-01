import nightvisionLogo from '../assets/images/nightvision.png';
import cloudfactoryLogo from '../assets/images/cloudfactory.png';

export const profile = {
  name: 'Aardish Duwal',
  role: 'Full Stack Developer Intern',
  company: 'Nightvision',
  email: 'aardish01@gmail.com',
  location: 'Bhaktapur, Nepal',
};

export const experience = [
  { role: profile.role, company: profile.company, status: 'Current role', logo: nightvisionLogo },
  { role: 'Data Annotator', company: 'CloudFactory', status: 'Current role', logo: cloudfactoryLogo },
];

export const education = [
  { qualification: 'Secondary Education Examination (SEE)', school: 'Mount Valley English School', status: 'Completed', label: 'The foundation' },
  { qualification: 'Higher Secondary · Computer Science', school: 'Khwopa College', status: 'Completed', label: 'Exploring technology' },
  { qualification: 'Bachelor of Computer Applications', school: 'Bhaktapur Multiple Campus', status: 'Ongoing', label: 'Building on curiosity' },
];

export const projects = [
  { title: 'AI Diabetes Risk System', category: 'Machine learning', stack: 'Python · Machine learning · Healthcare AI', repo: 'AI-Based-Diabetes-Risk-Management-System', description: 'An AI-powered system for diabetes risk assessment, combining predictive analytics with healthcare data processing.', image: '', demo: '' }, // TODO: add image path and demo URL
  { title: 'Student Performance', category: 'Data analytics', stack: 'Pandas · Streamlit · Plotly', repo: 'Student-performance-dashboard', description: 'An interactive dashboard exploring student performance trends with Python, Pandas, NumPy, and Plotly.', image: '', demo: '' }, // TODO: add image path and demo URL
  { title: 'RDS Gears', category: 'Web development', stack: 'PHP · E-commerce · Khalti', repo: 'R.D.S-Gears---E-commerce-Website-For-Electornics-goods', description: 'An electronics e-commerce website with an integrated Khalti payment gateway.', image: '', demo: '' }, // TODO: add image path and demo URL
  { title: 'Product Recommender', category: 'Machine learning', stack: 'Scikit-learn · Streamlit · SciPy', repo: 'e-commerce-product-recommendation-system', description: 'A machine learning recommendation engine that uses product data to surface relevant items.', image: '', demo: '' }, // TODO: add image path and demo URL
  { title: 'Ride Demand Analysis', category: 'Data analytics', stack: 'Python · NumPy · Power BI', repo: 'Ride-Sharing-Ride-demand-Analysis', description: 'An analysis of peak ride demand, fare trends, and trip patterns, brought together in an interactive Power BI dashboard.', image: '', demo: '' }, // TODO: add image path and demo URL
  { title: 'Real Estate Platform', category: 'Web development', stack: 'PHP · MySQL · Booking', repo: 'Real-Estate-Management-System', description: 'A property management platform with listings, agent registration, an admin panel, and booking functionality.', image: '', demo: '' }, // TODO: add image path and demo URL
];

export const socials = [
  ['GitHub', 'https://github.com/ardish01'],
  ['LinkedIn', 'https://www.linkedin.com/in/aardish-duwal-0371672a2'],
  ['Instagram', 'https://www.instagram.com/aardish_duwal/'],
  ['Twitter', 'https://twitter.com/aardishduw34120'],
  ['Facebook', 'https://www.facebook.com/profile.php?id=100078305356282'],
];
