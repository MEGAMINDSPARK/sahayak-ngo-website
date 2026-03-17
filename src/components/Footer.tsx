interface FooterProps {
  onNavigate: (page: string) => void;
}

const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-primary text-white py-4 mt-5">
      <div className="container">
        <div className="row gy-4">
          <div className="col-12 col-md-4 text-center text-md-start">
            <h5>Sahayak NGO</h5>
            <p>Making a difference in the community through compassion and service.</p>
          </div>
          <div className="col-12 col-md-4 text-center text-md-start">
            <h5>Quick Links</h5>
            <ul className="list-unstyled row row-cols-2 g-2">
              <li className="col">
                <a
                  href="#"
                  className="text-white"
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate('about');
                  }}
                >
                  About Us
                </a>
              </li>
              <li className="col">
                <a
                  href="#"
                  className="text-white"
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate('campaigns');
                  }}
                >
                  Campaigns
                </a>
              </li>
              <li className="col">
                <a
                  href="#"
                  className="text-white"
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate('volunteer');
                  }}
                >
                  Volunteer
                </a>
              </li>
              <li className="col">
                <a
                  href="#"
                  className="text-white"
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate('contact');
                  }}
                >
                  Contact
                </a>
              </li>
              <li className="col">
                <a
                  href="#"
                  className="text-white"
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate('privacy-policy');
                  }}
                >
                  Privacy Policy
                </a>
              </li>
              <li className="col">
                <a
                  href="#"
                  className="text-white"
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate('terms');
                  }}
                >
                  Terms &amp; Conditions
                </a>
              </li>
              <li className="col">
                <a
                  href="#"
                  className="text-white"
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate('faq');
                  }}
                >
                  FAQ
                </a>
              </li>
            </ul>
          </div>
          <div className="col-12 col-md-4 text-center text-md-start">
            <h5>Contact Info</h5>
            <p>Email: info@sahayakngo.org</p>
            <p>Phone: +91 9876543210</p>
          </div>
        </div>
        <hr className="bg-white" />
        <div className="text-center">
          <p className="mb-0">&copy; 2026 Sahayak NGO. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
