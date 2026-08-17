import React, { useState } from 'react';
import '../styles/pages/GroupCompaniesPage.css';
import '../styles/kiosk-overrides.css';
import { PrimaryNav } from '../components/shared.jsx';

const groupCompanies = [
  {
    name: 'SRMB Srijan Private Limited',
    rows: [
      { label: 'Board of Directors', value: ['Brij Mohan Beriwala', 'Nikunj Beriwala', 'Ashish Beriwala'] },
      { label: 'Date of Incorporation', value: '28.11.2001' },
      { label: 'Registered Address', value: 'SRMB House, 7, Khetra Das Lane, Kolkata - 700012' },
      { label: 'CIN', value: 'U74994WB2001PTC093969' },
      { label: 'Capital Structure', value: ['Authorised: Rs. 27 Cr.', 'Paid Up: Rs. 20.97 Cr.'] },
      {
        label: 'Brief Profile',
        value: [
          'The company is engaged in manufacturing of billets and TMT bars. Its product portfolio includes TMT bars, REAL EDGE grill, real wire, real ring, steel road plate, MS angle and channel.',
          'The manufacturing unit is located in Durgapur, West Bengal, and runs with its rolling mill, SMS and hot billet unit.',
          'SRMB has a chain of value added products including TMT bars manufactured as per IS 1786:2008 in Fe 500+ and structurals as per IS 2062:2006.',
          'The company enjoys strong goodwill of its SRMB 500+ and REALEDGE brands, along with the logo Leadership through Innovation.',
          'SRMB has an established customer base, a pan-India dealer network and branch offices.',
        ],
      },
      { label: 'Industry Type', value: 'Metals and Minerals' },
      { label: 'Segment', value: 'Steel' },
      { label: 'Summary of Financials', value: 'Financial as on 31.03.2021 is attached in the source PDF.' },
    ],
  },
  {
    name: 'Pinnacle KPO Solutions Private Limited',
    rows: [
      { label: 'Board of Directors', value: ['Nikunj Beriwala', 'Ashish Beriwala'] },
      { label: 'Date of Incorporation', value: '14.05.2010' },
      { label: 'Registered Address', value: 'SRMB House, 7, Khetra Das Lane, Kolkata - 700012' },
      { label: 'CIN', value: 'U72300WB2010PTC147924' },
      { label: 'Capital Structure', value: ['Authorised: Rs. 7.40 Cr.', 'Paid Up: Rs. 7.40 Cr.'] },
      {
        label: 'Brief Profile',
        value: [
          'The main object of the company is real estate development and construction activity, along with renting of real estate.',
          'The company also runs an in-house retail store where it purchases materials from SRMB Srijan Private Limited and Tech Nirman Ispat Private Limited and sells them in the open market.',
          'It also purchases construction materials such as cement and paint from outside vendors and sells them in the open market.',
          'The company enjoys goodwill of the REAL BUILD brand.',
        ],
      },
      { label: 'Industry Type', value: 'Real Estate' },
      { label: 'Segment', value: 'Builders and Developers' },
    ],
  },
  {
    name: 'Advay Udyog Private Limited',
    rows: [
      { label: 'Board of Directors', value: ['Nikunj Beriwala', 'Ashish Beriwala'] },
      { label: 'Date of Incorporation', value: '13.11.2019' },
      { label: 'Registered Address', value: 'SRMB House, 7, Khetra Das Lane, Kolkata - 700012' },
      { label: 'CIN', value: 'U13204WB2019PTC234715' },
      { label: 'Capital Structure', value: ['Authorised: Rs. 6.65 Cr.', 'Paid Up: Rs. 5.10 Cr.'] },
      {
        label: 'Brief Profile',
        value: [
          'The main object of the company is mine quarries and allied business.',
          'The company has a proposed plant at Barjora, Bankura.',
          'The company is availing 15% income tax benefit.',
        ],
      },
      { label: 'Industry Type', value: 'Metals and Minerals' },
      { label: 'Segment', value: 'Mining' },
    ],
  },
  {
    name: 'Uddhav Udyog Private Limited',
    rows: [
      { label: 'Board of Directors', value: ['Nikunj Beriwala', 'Ashish Beriwala'] },
      { label: 'Date of Incorporation', value: '07.11.2019' },
      { label: 'Registered Address', value: 'SRMB House, 7, Khetra Das Lane, Kolkata - 700012' },
      { label: 'CIN', value: 'U27209WB2019PTC234661' },
      { label: 'Capital Structure', value: ['Authorised: Rs. 45.85 Crore', 'Paid Up: Rs. 44.22 Crore'] },
      {
        label: 'Brief Profile',
        value: [
          'The main object of the company is mine quarries and allied business.',
          'The company has a proposed plant at Panagarh, Bardhaman.',
          'The company is availing 15% income tax benefit.',
        ],
      },
      { label: 'Industry Type', value: 'Metals and Minerals' },
      { label: 'Segment', value: 'Mining' },
    ],
  },
  {
    name: 'Udhav Infrastructure Private Limited',
    rows: [
      { label: 'Former Name', value: 'Udhav IT Services Private Limited' },
      { label: 'Board of Directors', value: ['Navin Bhuwalka', 'Ashish Beriwala'] },
      { label: 'Date of Incorporation', value: '05.05.2010' },
      { label: 'Registered Address', value: 'SRMB House, 7, Khetra Das Lane, Kolkata - 700012' },
      { label: 'CIN', value: 'U72300WB2010PTC146700' },
      { label: 'Capital Structure', value: ['Authorised: Rs. 10 Lakhs', 'Paid Up: Rs. 2 Lakhs'] },
      {
        label: 'Brief Profile',
        value: [
          'The main object of the company is developing and maintaining computer software, providing technical consultancy services and marketing technical information.',
          'It also provides services, erection and commissioning through system analysts, programmers, software experts, contractors, selling agents, consultants, advisors and merchants.',
          'The company is dormant and proposed to be struck off.',
        ],
      },
      { label: 'Industry Type', value: 'Information Technology' },
      { label: 'Segment', value: 'IT Consulting and Other Services' },
    ],
  },
  {
    name: 'Vidushi Properties Private Limited',
    rows: [
      { label: 'Board of Directors', value: ['Nikunj Beriwala', 'Suman Beriwala'] },
      { label: 'Date of Incorporation', value: '05.05.2010' },
      { label: 'Registered Address', value: 'SRMB House, 7, Khetra Das Lane, Kolkata - 700012' },
      { label: 'CIN', value: 'U45400WB2010PTC146698' },
      { label: 'Capital Structure', value: ['Authorised: Rs. 50 Lakhs', 'Paid Up: Rs. 29 Lakhs'] },
      {
        label: 'Brief Profile',
        value: [
          'The main object of the company is construction by purchasing, acquiring, leasing and hiring land.',
          'It prepares building sites and also acts as broker and agent for dealing, purchasing and selling lands and properties.',
          'The company holds 37% equity shares of SRMB Srijan Private Limited and 14% equity shares of Welkan Vinimay Private Limited.',
        ],
      },
      { label: 'Industry Type', value: 'Real Estate' },
      { label: 'Segment', value: 'Builders and Developers' },
    ],
  },
  {
    name: 'Tech Nirman Ispat Private Limited',
    rows: [
      { label: 'Board of Directors', value: ['Nikunj Beriwala', 'Ashish Beriwala'] },
      { label: 'Date of Incorporation', value: '31.07.2013' },
      { label: 'Registered Address', value: '46, Bipin Behari Ganguly Street, 5th Floor, Kolkata - 700012' },
      { label: 'CIN', value: 'U45400WB2013PTC195929' },
      { label: 'Capital Structure', value: ['Authorised: Rs. 10 Lakhs', 'Paid Up: Rs. 1 Lakh'] },
      {
        label: 'Brief Profile',
        value: [
          'The main object of the company is trading of TMT bars.',
          'The company purchases TMT bars from SRMB Srijan Private Limited and trades the same in the market.',
          'The company enjoys goodwill of the TOPTECH brand.',
        ],
      },
      { label: 'Industry Type', value: 'Metals and Minerals' },
      { label: 'Segment', value: 'Steel' },
    ],
  },
  {
    name: 'Jeenmata Commercial Private Limited',
    rows: [
      { label: 'Board of Directors', value: ['Nikunj Beriwala', 'Ashish Beriwala'] },
      { label: 'Date of Incorporation', value: '28.09.2010' },
      { label: 'Registered Address', value: '46, Bipin Behari Ganguly Street, 5th Floor, Kolkata - 700012' },
      { label: 'CIN', value: 'U52390WB2010PTC153564' },
      { label: 'Capital Structure', value: ['Authorised: Rs. 52 Lakhs', 'Paid Up: Rs. 51.22 Lakhs'] },
      {
        label: 'Brief Profile',
        value: [
          'The main object of the company is trading, buying, selling, marketing, distribution and dealing in home care products, consumer products, household goods, industrial goods, engineering goods and electrical/electronic products.',
          'It also deals in food articles, sugar, spices, pulses, agricultural products, hardware, plant and machinery, stores, spare parts, clothes, fabrics, paper products, plastic, leather, footwear, rubber and plantation crops.',
          'The company holds 26% equity shares of SRMB Srijan Private Limited.',
          'It holds 57.14% preference shares in Pinnacle KPO Solutions Private Limited, 80.77% preference shares in Uddhav Udyog Private Limited and 60% preference shares in Advay Udyog Private Limited.',
        ],
      },
      { label: 'Industry Type', value: 'Consumer Services' },
    ],
  },
  {
    name: 'Anirdesh Projects Limited',
    rows: [
      { label: 'Board of Directors', value: ['Brij Mohan Beriwala', 'Nikunj Beriwala', 'Ashish Beriwala'] },
      { label: 'Date of Incorporation', value: '09.04.2013' },
      { label: 'Registered Address', value: '46, Bipin Behari Ganguly Street, 5th Floor, Kolkata - 700012' },
      { label: 'CIN', value: 'U70102WB2013PLC192081' },
      { label: 'Capital Structure', value: ['Authorised: Rs. 6 Lakh', 'Paid Up: Rs. 6 Lakh'] },
      {
        label: 'Brief Profile',
        value: [
          'The company carries on the business of builders, developers, erectors and constructors of buildings, houses, apartments, ownership flats and structures for residential, office, industrial, institutional, complex and commercial establishments.',
          'It also covers bridges, dams, tunnels, canals and other civil engineering work.',
          'The company develops cooperative housing societies and housing schemes, prepares building sites and undertakes construction, reconstruction, erection and alteration of buildings.',
          'It also works on warehouses, workshops, hospitals, nursing homes, clinics, godowns, commercial and educational facilities, and invests in, holds, rents, hires and leases such properties.',
          'The company is the holding company of Jeenmata Commercial Private Limited.',
        ],
      },
      { label: 'Industry Type', value: 'Real Estate' },
      { label: 'Segment', value: 'Builders and Developers' },
    ],
  },
  {
    name: 'Sri Narsingh Infraheights Private Limited',
    rows: [
      { label: 'Board of Directors', value: ['Sambhu Dayal Agarwal', 'Sanjay Parui'] },
      { label: 'Date of Incorporation', value: '24.05.2013' },
      { label: 'Registered Address', value: '13, Bipin Behari Ganguly Street, 4th Floor, Room No. 401, Kolkata - 700012' },
      { label: 'CIN', value: 'U70102WB2013PTC193734' },
      { label: 'Capital Structure', value: ['Authorised: Rs. 1 Lakh', 'Paid Up: Rs. 1 Lakh'] },
      {
        label: 'Brief Profile',
        value: [
          'The company is engaged in the business of dealing with basic iron and steel.',
          'The company is dormant and proposed to be struck off.',
        ],
      },
      { label: 'Industry Type', value: 'Metals and Minerals' },
      { label: 'Segment', value: 'Metal Retailers and Distributors' },
    ],
  },
  {
    name: 'Welkan Vinimay Private Limited',
    rows: [
      { label: 'Board of Directors', value: ['Navin Bhuwalka', 'Vivek Bansal'] },
      { label: 'Date of Incorporation', value: '22.03.1994' },
      { label: 'Registered Address', value: '7, Khetra Das Lane, Kolkata - 700012' },
      { label: 'CIN', value: 'U51909WB1994PTC062441' },
      { label: 'RBI Registration No.', value: 'B.05.06327 dated 26.04.2004' },
      { label: 'Capital Structure', value: ['Authorised: Rs. 4.75 Cr.', 'Paid Up: Rs. 3.39 Cr.'] },
      {
        label: 'Brief Profile',
        value: [
          'The company is registered with RBI.',
          'It undertakes investment in shares, debentures and bonds of different mutual fund schemes and also makes inter-corporate and other loans with Indian companies.',
          'Its memorandum objects include buying, selling, trading, merchanting, broking and agency activities for rubberized cloth, food grains, dairy products, leather garments, electrical and electronic components, stationery, tools, hardware, plastics and other goods and merchandise.',
          'The company holds 42.86% preference shares in Pinnacle KPO Solutions Private Limited, 19.23% preference shares in Uddhav Udyog Private Limited and 40% preference shares in Advay Udyog Private Limited.',
        ],
      },
      { label: 'Industry Type', value: 'BFSI' },
      { label: 'Segment', value: 'NBFC - Non accepting public deposit' },
    ],
  },
  {
    name: 'Nav-Nikunj Infra LLP',
    rows: [
      { label: 'Designated Partners', value: ['Nikunj Beriwala', 'Ashish Beriwala'] },
      { label: 'Partners', value: ['Suman Beriwala', 'Sweta Beriwala', 'Kirti Beriwala'] },
      { label: 'Date of Incorporation', value: '04.09.2021' },
      { label: 'Registered Address', value: '7, Khetra Das Lane, Kolkata - 700012' },
      { label: 'LLPIN', value: 'AAY-4562' },
      { label: 'Capital Structure', value: 'Capital: Rs. 3 Crore' },
      {
        label: 'Profit Sharing Ratio',
        value: [
          'Suman Beriwala: 30%',
          'Sweta Beriwala: 30%',
          'Kirti Beriwala: 30%',
          'Nikunj Beriwala: 5%',
          'Ashish Beriwala: 5%',
        ],
      },
      {
        label: 'Brief Profile',
        value: [
          'The LLP is engaged in taking on lease, rent and hire, and in constructing, building, establishing, erecting, promoting, undertaking, acquiring, owning, operating, leasing, equipping, managing, renovating, reconditioning and maintaining warehouses, godowns, open platforms, refrigeration houses, stores and similar establishments.',
          'It provides storage facilities for commodities, goods, articles and things, and carries on allied activities.',
          'The LLP has a commercial godown in Shrirampur and earns rental income from the godown.',
        ],
      },
      { label: 'Industry Type', value: 'Infrastructure' },
      { label: 'Segment', value: 'Infrastructure Services' },
    ],
  },
  {
    name: 'Navya IT Software Solutions LLP',
    rows: [
      { label: 'Designated Partners', value: ['Brij Mohan Beriwala', 'Nikunj Beriwala', 'Ashish Beriwala'] },
      { label: 'Date of Incorporation', value: '16.11.2021' },
      { label: 'Registered Address', value: '7, Khetra Das Lane, Kolkata - 700012' },
      { label: 'LLPIN', value: 'AAZ-4939' },
      { label: 'Capital Structure', value: 'Capital: Rs. 30 Lakhs' },
      {
        label: 'Profit Sharing Ratio',
        value: ['Brij Mohan Beriwala: 33.34%', 'Nikunj Beriwala: 33.33%', 'Kirti Beriwala: 33.33%'],
      },
      {
        label: 'Brief Profile',
        value: [
          'The LLP is a startup.',
          'The main division is Navya IT Software Solutions LLP - Products and Services Support.',
          'The business develops and supports a full line of PC-based business software applications.',
          'It also develops and supports ad-based internet marketplaces, custom-developed bidding and freight bidding software, and other hosted business products tailored for the industrial marketplace.',
          'The LLP has received DPIIT recognition vide DIPP96790.',
          'It has a tax holiday for 3 years as a startup, subject to certification from the Inter-Ministerial Board.',
        ],
      },
    ],
  },
];

function DetailValue({ value }) {
  if (Array.isArray(value)) {
    return (
      <ul className="group-detail-list">
        {value.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    );
  }

  return <p>{value}</p>;
}

export default function GroupCompaniesPage({ onNavigate }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeCompany = groupCompanies[activeIndex];

  return (
    <main className="screen about-screen group-companies-screen title-simple-page">
      <section className="about-panel group-companies-panel">
        <header className="about-header group-companies-header">
          <div className="about-title-bar">
            <h1>GROUP OF COMPANIES</h1>
          </div>
          <div className="about-logo-box">
            <img src="/assets/applogo/download.jpg" alt="SRMB" />
          </div>
        </header>

        <section className="group-companies-stage" aria-label="Brief about group companies">
          <aside className="group-company-index" aria-label="Select company">
            <div className="group-index-heading">
              <strong>{groupCompanies.length} Companies</strong>
            </div>

            {groupCompanies.map((company, index) => (
              <button
                className={`group-index-button ${index === activeIndex ? 'active' : ''}`}
                key={company.name}
                type="button"
                onClick={() => setActiveIndex(index)}
                aria-current={index === activeIndex ? 'true' : undefined}
              >
                <span>{String(index + 1).padStart(2, '0')}</span>
                <strong>{company.name}</strong>
              </button>
            ))}
          </aside>

          <article className="group-pdf-sheet" key={activeCompany.name}>
            <div className="group-table-wrap">
              <table className="group-info-table">
                <thead>
                  <tr>
                    <th>Sl. No.</th>
                    <th>Particulars</th>
                    <th>Details</th>
                  </tr>
                </thead>
                <tbody>
                  {activeCompany.rows.map((row, index) => (
                    <tr key={row.label}>
                      <td>{index + 1}</td>
                      <td>{row.label}</td>
                      <td>
                        <DetailValue value={row.value} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </article>
        </section>

        <PrimaryNav activePage="group-companies" onNavigate={onNavigate} />
      </section>
    </main>
  );
}
