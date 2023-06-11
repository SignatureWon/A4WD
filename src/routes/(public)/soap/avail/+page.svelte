<script>
  // import { onMount } from "svelte";
  // import soapRequest from "easy-soap-request";

  // const url = "https://otautils.thlonline.com/Aurora_OTA.asmx";
  // const hdr = {
  //   "Content-Type": "text/xml;charset=UTF-8",
  //   "soapAction": "http://www.thlrentals.com/Aurora/OTA/LoginOk",
  // };
  // const xml = `<soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  //              xmlns:xsd="http://www.w3.org/2001/XMLSchema"
  //              xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
  //                 <soap:Body>
  //                     <LoginOk xmlns="http://www.thlrentals.com/Aurora/OTA">
  //                         <THL_LoginOkRQ
  //                             xmlns:xsd="http://www.w3.org/2001/XMLSchema"
  //                             xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  //                             EchoToken="Token"
  //                             Target="Test"
  //                             Version="1.1"
  //                             xmlns="http://www.opentravel.org/OTA/2003/05">
  //                             <email>demo.ota@thlonline.com</email>
  //                             <IsAgent>true</IsAgent>
  //                             <password>3"$r$#3>)+\\kgC*m</password>
  //                         </THL_LoginOkRQ>
  //                     </LoginOk>
  //                 </soap:Body>
  //             </soap:Envelope>`;

  // onMount(async () => {
  //   const { response } = await soapRequest({
  //     url: url,
  //     headers: hdr,
  //     xml: xml,
  //   });
  //   console.log("response:", response);

  //   const { headers, body, statusCode } = response;
  //   console.log('headers:', headers);
  //   console.log('body:', body);
  //   console.log('statusCode:', statusCode);
  // });

  export let data;

  // console.log(data);
  
</script>
