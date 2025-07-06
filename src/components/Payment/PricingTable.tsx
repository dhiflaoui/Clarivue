// import Script from "next/script";

// interface Props {
//   clientReferenceId: string;
//   customerEmail: string;
// }

// const PricingTable = ({ clientReferenceId, customerEmail }: Props) => {
//   return (
//     <>
//       <Script
//         async
//         strategy="lazyOnload"
//         src="https://js.stripe.com/v3/pricing-table.js"
//       />
//       <stripe-pricing-table
//         pricing-table-id="prctbl_1Rhg3x4NMGGHNGpUDavkkVDt"
//         publishable-key="pk_test_51RhfjK4NMGGHNGpU7nvmwUAJOULVd2vTxz7iEgHwbJ00tcJGvb1qllHizQvT9l3XSZFi8rnP2C4yQZcA32D9ty9100UeksV1N7"
//         client-reference-id={clientReferenceId}
//         customer-email={customerEmail}
//       />
//     </>
//   );
// };

// // // If using TypeScript, add the following snippet to your file as well.
// declare global {
//   namespace JSX {
//     interface IntrinsicElements {
//       "stripe-pricing-table": React.DetailedHTMLProps<
//         React.HTMLAttributes<HTMLElement>,
//         HTMLElement
//       >;
//     }
//   }
// }

// export default PricingTable;
import Script from "next/script";
import React from "react";

interface Props {
  clientReferenceId: string;
  customerEmail: string;
}

const PricingTable = ({ clientReferenceId, customerEmail }: Props) => {
  return (
    <>
      <Script
        async
        strategy="lazyOnload"
        src="https://js.stripe.com/v3/pricing-table.js"
      />
      {React.createElement("stripe-pricing-table", {
        "pricing-table-id": "prctbl_1Rhg3x4NMGGHNGpUDavkkVDt",
        "publishable-key":
          "pk_test_51RhfjK4NMGGHNGpU7nvmwUAJOULVd2vTxz7iEgHwbJ00tcJGvb1qllHizQvT9l3XSZFi8rnP2C4yQZcA32D9ty9100UeksV1N7",
        "client-reference-id": clientReferenceId,
        "customer-email": customerEmail,
      })}
    </>
  );
};

export default PricingTable;
