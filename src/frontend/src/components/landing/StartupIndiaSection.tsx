export function StartupIndiaSection() {
  return (
    <section
      className="py-16 bg-gradient-to-br from-blue-50 via-white to-orange-50"
      data-ocid="startup_india.section"
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Badge */}
        <div className="flex justify-center mb-6">
          <span className="inline-flex items-center gap-2 bg-orange-100 text-orange-700 font-semibold text-sm px-4 py-2 rounded-full border border-orange-200">
            🇮🇳 Government of India Recognized
          </span>
        </div>

        {/* Title */}
        <div className="text-center mb-10">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
            Openframe IT Solutions Pvt. Ltd.
          </h2>
          <p className="text-xl font-semibold text-blue-700">
            Recognized under{" "}
            <span className="text-orange-600">#StartupIndia</span>
          </p>
        </div>

        {/* Announcement */}
        <div className="bg-white rounded-2xl shadow-md border border-blue-100 p-6 sm:p-8 mb-8">
          <p className="text-gray-700 text-base sm:text-lg leading-relaxed mb-4">
            We are proud to announce that{" "}
            <strong>Openframe IT Solutions Private Limited</strong> has
            officially received the <strong>Certificate of Recognition</strong>{" "}
            from the Government of India under the Startup India initiative.
          </p>
          <p className="text-gray-600 text-base leading-relaxed">
            This recognition has been granted by the{" "}
            <strong>
              Department for Promotion of Industry and Internal Trade (DPIIT)
            </strong>
            , Ministry of Commerce &amp; Industry, Government of India.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Certificate Image */}
          <div className="flex flex-col items-center">
            <div className="rounded-2xl overflow-hidden shadow-lg border-4 border-blue-100 w-full">
              <img
                src="/assets/uploads/WhatsApp-Image-2026-03-07-at-1.18.58-AM-1.jpeg"
                alt="Startup India Certificate of Recognition - Openframe IT Solutions Pvt. Ltd."
                className="w-full object-contain"
                data-ocid="startup_india.certificate_image"
              />
            </div>
            <p className="mt-3 text-sm text-gray-500 text-center">
              Certificate No: DIPP153945
            </p>
          </div>

          {/* Certificate Details */}
          <div className="flex flex-col gap-4">
            <h3 className="text-xl font-bold text-gray-800 border-b border-blue-100 pb-2">
              Certificate Details
            </h3>
            <div className="space-y-3">
              {[
                {
                  label: "Company Name",
                  value: "Openframe IT Solutions Private Limited",
                },
                {
                  label: "Recognized By",
                  value:
                    "Department for Promotion of Industry and Internal Trade (DPIIT)",
                },
                {
                  label: "Ministry",
                  value: "Ministry of Commerce & Industry, Government of India",
                },
                {
                  label: "Industry Category",
                  value: "Education Industry and E-Learning Sector",
                },
                { label: "Date of Issue", value: "13 January 2024" },
                { label: "Valid Until", value: "24 October 2033" },
              ].map(({ label, value }) => (
                <div key={label} className="bg-blue-50 rounded-lg px-4 py-3">
                  <span className="block text-xs font-semibold text-blue-500 uppercase tracking-wide">
                    {label}
                  </span>
                  <span className="block text-gray-800 font-medium text-sm mt-0.5">
                    {value}
                  </span>
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-400 italic mt-1">
              This certification remains valid for 10 years from the date of
              incorporation, provided the company turnover does not exceed ₹100
              crore in any financial year.
            </p>
          </div>
        </div>

        {/* What This Means */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-6 sm:p-8 text-white mb-8">
          <h3 className="text-xl font-bold mb-3">
            What This Recognition Means
          </h3>
          <p className="text-blue-100 leading-relaxed">
            Startup India recognition is given to innovative companies that are
            contributing to the growth of India's economy through technology,
            innovation, and job creation. With this certification, Openframe IT
            Solutions Pvt. Ltd. is officially recognized as a startup working in
            the{" "}
            <strong className="text-white">
              Education and E-Learning sector
            </strong>
            .
          </p>
          <p className="text-blue-100 mt-3 leading-relaxed">
            This recognition confirms that our company meets the government's
            criteria for innovation, scalability, and potential to create
            impact.
          </p>
        </div>

        {/* Our Mission */}
        <div className="bg-white rounded-2xl shadow-md border border-orange-100 p-6 sm:p-8 mb-8">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Our Mission</h3>
          <p className="text-gray-700 leading-relaxed mb-4">
            At Openframe IT Solutions Pvt. Ltd., our mission is to empower
            individuals with education, skill development, digital learning, and
            employment opportunities.
          </p>
          <p className="text-gray-700 font-medium mb-3">
            Our platform focuses on:
          </p>
          <ul className="space-y-2">
            {[
              "Online education and skill development programs",
              "Certification-based learning",
              "Digital training and corporate learning systems",
              "Student development and career guidance",
              "Technology solutions for education",
            ].map((item) => (
              <li key={item} className="flex items-start gap-2 text-gray-700">
                <span className="text-orange-500 font-bold mt-0.5">✔</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <p className="text-gray-600 mt-4 italic">
            We believe education should be accessible, practical, and
            career-focused, helping students and professionals build real
            skills.
          </p>
        </div>

        {/* Commitment & Vision */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
          <div className="bg-orange-50 border border-orange-100 rounded-2xl p-6">
            <h4 className="text-lg font-bold text-orange-700 mb-2">
              Commitment to Innovation
            </h4>
            <p className="text-gray-700 text-sm leading-relaxed">
              Being recognized under Startup India motivates us to continue
              building innovative education solutions that can help thousands of
              students and professionals improve their future.
            </p>
          </div>
          <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6">
            <h4 className="text-lg font-bold text-blue-700 mb-2">
              Looking Forward
            </h4>
            <p className="text-gray-700 text-sm leading-relaxed">
              This government recognition is an important milestone for our
              journey. It strengthens our credibility and inspires us to work
              harder to create impactful solutions in the education and
              technology sectors.
            </p>
          </div>
        </div>

        {/* Footer tagline */}
        <div className="text-center border-t border-gray-200 pt-8">
          <p className="text-gray-500 text-sm mb-1">
            We thank our team, partners, and supporters who believe in our
            mission to transform education through technology.
          </p>
          <p className="text-xl font-bold text-blue-700 mt-3">
            Openframe IT Solutions Pvt. Ltd.
          </p>
          <p className="text-orange-600 font-semibold">
            Empowering Education Through Innovation
          </p>
          <a
            href="tel:7996401388"
            className="inline-flex items-center gap-2 mt-3 text-gray-600 hover:text-blue-700 transition-colors text-sm font-medium"
            data-ocid="startup_india.contact_link"
          >
            📞 Contact: 7996401388
          </a>
        </div>
      </div>
    </section>
  );
}
