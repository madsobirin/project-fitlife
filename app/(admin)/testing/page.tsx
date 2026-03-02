import CardNav from "@/components/CardNav";

const TestingPage = () => {
  const items = [
    {
      label: "Kalkulator BMI",
      bgColor: "#002b17",
      textColor: "#fff",
      links: [
        {
          label: "Company",
          href: "/about/company",
          ariaLabel: "About Company",
        },
        {
          label: "Careers",
          href: "/about/careers",
          ariaLabel: "About Careers",
        },
      ],
    },
    {
      label: "Menu Sehat",
      bgColor: "#002b17",
      textColor: "#fff",
      links: [
        {
          label: "Featured",
          href: "/projects/featured",
          ariaLabel: "Featured Projects",
        },
        {
          label: "Case Studies",
          href: "/projects/case-studies",
          ariaLabel: "Project Case Studies",
        },
      ],
    },
    {
      label: "Artikel",
      bgColor: "#002b17",
      textColor: "#fff",
      links: [
        { label: "Email", href: "/contact/email", ariaLabel: "Email us" },
        { label: "Twitter", href: "/contact/twitter", ariaLabel: "Twitter" },
        { label: "LinkedIn", href: "/contact/linkedin", ariaLabel: "LinkedIn" },
      ],
    },
  ];

  return (
    <CardNav
      logo="/logo.png"
      logoAlt="Company Logo"
      items={items}
      baseColor="#fff"
      menuColor="#000"
      buttonBgColor="#18382b"
      buttonTextColor="#fff"
      darkBaseColor="#0f1f17"
      darkMenuColor="#a8d5ba"
      darkButtonBgColor="#a8d5ba"
      darkButtonTextColor="#0f1f17"
      darkCardBgColor="#132b1e"
      darkCardTextColor="#d4e8dc"
      ease="power3.out"
      className="rounded-md"
    />
  );
};

export default TestingPage;
