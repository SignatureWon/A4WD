import soapRequest from "easy-soap-request";
import { thl } from "$lib/thlClient";

export async function load() {
  let thlLogin = false;
  thl.subscribe((val) => (thlLogin = val));

  // console.log(thlLogin);

  const url = "https://otautils.thlonline.com/Aurora_OTA.asmx";
  const hdr = {
    "Content-Type": "text/xml;charset=UTF-8",
    soapAction: "http://www.thlrentals.com/Aurora/OTA/VehAvailRate",
  };
  const xml = `
  <soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xmlns:xsd="http://www.w3.org/2001/XMLSchema"
    xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
    <soap:Body>
      <VehAvailRate xmlns="http://www.thlrentals.com/Aurora/OTA">
        <OTA_VehAvailRateRQ
          xmlns:xsd="http://www.w3.org/2001/XMLSchema"
          xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
          EchoToken="${thlLogin.EchoToken}"
          Target="Test"
          Version="1"
          MaxResponses="3"
          TimeStamp="2023-04-01T00:00:00Z"
          xmlns="http://www.opentravel.org/OTA/2003/05">

          <POS>
            <Source
              AgentSine="${thlLogin.AgentSine}"
              AgentDutyCode="${thlLogin.AgentDutyCode}"
              ERSP_UserID="${thlLogin.ERSP_UserID}">
              <RequestorID Type="${thlLogin.RequestorType}" ID="${thlLogin.RequestorID}" />
            </Source>
          </POS>
          <VehAvailRQCore Status="Available">
            <VehRentalCore PickUpDateTime="2023-05-17T08:00:00" ReturnDateTime="2023-05-26T08:00:00">
              <PickUpLocation LocationCode="ADL" CodeContext="ADL">ADL</PickUpLocation>
              <ReturnLocation LocationCode="SYD" CodeContext="SYD">SYD</ReturnLocation>
            </VehRentalCore>
            <VendorPrefs>
              <VendorPref CompanyShortName="NA" PreferLevel="Only" />
            </VendorPrefs>
            <VehPrefs>
              <VehPref TypePref="Only" ClassPref="Only">
                <VehType VehicleCategory="NA" />
                <VehClass Size="NA" />
              </VehPref>
            </VehPrefs>
            <RateQualifier RateQualifier="SRT" />
          </VehAvailRQCore>
          <VehAvailRQInfo>
            <CoveragePrefs>
              <CoveragePref Code="INCPACKP" CoverageType="" PreferLevel="Only" />
            </CoveragePrefs>
          </VehAvailRQInfo>
        </OTA_VehAvailRateRQ>
      </VehAvailRate>
    </soap:Body>
  </soap:Envelope>`

  const { response } = await soapRequest({
    url: url,
    headers: hdr,
    xml: xml,
  });
//   console.log("response:", response);

  const { headers, body, statusCode } = response;
//   console.log("headers:", headers);
//   console.log("body:", body);
//   console.log("statusCode:", statusCode);

//   return {response};

  return {thl: body}
}
