const Faq = () => {
  return (
    <div>
      <section
        className="py-5 text-white"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0,0,0,0.55), rgba(0,0,0,0.55)), url('https://images.unsplash.com/photo-1496307042754-b4aa456c4a2d?auto=format&fit=crop&w=1400&q=80')",
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="container text-center">
          <h1 className="display-5 fw-bold mb-3">Frequently Asked Questions</h1>
          <p className="lead mb-0">Quick answers about donations, campaigns, and volunteering.</p>
        </div>
      </section>

      <section className="py-5">
        <div className="container">
          <div className="accordion" id="faqAccordion">
            <div className="accordion-item">
              <h2 className="accordion-header" id="faqOne">
                <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#faqCollapseOne">
                  How do I donate to a campaign?
                </button>
              </h2>
              <div id="faqCollapseOne" className="accordion-collapse collapse show" data-bs-parent="#faqAccordion">
                <div className="accordion-body">
                  Go to the Campaigns page, choose a campaign, and click Donate Now. You can also donate from the Donate page.
                </div>
              </div>
            </div>

            <div className="accordion-item">
              <h2 className="accordion-header" id="faqTwo">
                <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#faqCollapseTwo">
                  How can I get my donation receipt?
                </button>
              </h2>
              <div id="faqCollapseTwo" className="accordion-collapse collapse" data-bs-parent="#faqAccordion">
                <div className="accordion-body">
                  Log in as a donor, open the Donor Dashboard, go to My Donations, and click Download Receipt.
                </div>
              </div>
            </div>

            <div className="accordion-item">
              <h2 className="accordion-header" id="faqThree">
                <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#faqCollapseThree">
                  Can I volunteer for events near me?
                </button>
              </h2>
              <div id="faqCollapseThree" className="accordion-collapse collapse" data-bs-parent="#faqAccordion">
                <div className="accordion-body">
                  Yes. Register as a volunteer, then check the Events page or Volunteer Dashboard for nearby opportunities.
                </div>
              </div>
            </div>

            <div className="accordion-item">
              <h2 className="accordion-header" id="faqFour">
                <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#faqCollapseFour">
                  How are donations used?
                </button>
              </h2>
              <div id="faqCollapseFour" className="accordion-collapse collapse" data-bs-parent="#faqAccordion">
                <div className="accordion-body">
                  Donations directly fund program activities such as education, healthcare, and community development projects.
                </div>
              </div>
            </div>

            <div className="accordion-item">
              <h2 className="accordion-header" id="faqFive">
                <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#faqCollapseFive">
                  Who can I contact for support?
                </button>
              </h2>
              <div id="faqCollapseFive" className="accordion-collapse collapse" data-bs-parent="#faqAccordion">
                <div className="accordion-body">
                  Use the Contact page or email info@sahayakngo.org and we will get back to you.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Faq;
