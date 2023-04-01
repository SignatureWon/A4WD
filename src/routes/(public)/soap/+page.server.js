import soapRequest from "easy-soap-request";
import { XMLParser } from "fast-xml-parser";
import { thl } from "$lib/thlClient";

export async function load() {
  const url = "https://otautils.thlonline.com/Aurora_OTA.asmx";
  const hdr = {
    "Content-Type": "text/xml;charset=UTF-8",
    soapAction: "http://www.thlrentals.com/Aurora/OTA/LoginOk",
  };
  const xml = `<soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
                 xmlns:xsd="http://www.w3.org/2001/XMLSchema"
                 xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
                    <soap:Body>
                        <LoginOk xmlns="http://www.thlrentals.com/Aurora/OTA">
                            <THL_LoginOkRQ
                                xmlns:xsd="http://www.w3.org/2001/XMLSchema"
                                xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
                                EchoToken="Token"
                                Target="Test"
                                Version="1.1"
                                xmlns="http://www.opentravel.org/OTA/2003/05">
                                <email>demo.ota@thlonline.com</email>
                                <IsAgent>true</IsAgent>
                                <password>3"$r$#3>)+\\kgC*m</password>
                            </THL_LoginOkRQ>
                        </LoginOk>
                    </soap:Body>
                </soap:Envelope>`;

  let thlLogin = false;
  thl.subscribe((val) => (thlLogin = val));

  if (!thlLogin) {
    const { response } = await soapRequest({
      url: url,
      headers: hdr,
      xml: xml,
    });

    const { headers, body, statusCode } = response;

    const options = {
      ignoreAttributes: false,
      attributeNamePrefix: "@",
    };

    const parser = new XMLParser(options);
    const json = parser.parse(body);

    const loginOk =
      json["soap:Envelope"]["soap:Body"]["LoginOkResponse"]["THL_LoginOkRS"];
    const source = loginOk["POS"]["Source"];

    thl.update(
      (val) =>
        (val = {
          EchoToken: loginOk["@EchoToken"],
          AgentSine: source["@AgentSine"],
          AgentDutyCode: source["@AgentDutyCode"],
          ERSP_UserID: source["@ERSP_UserID"],
          RequestorType: source.RequestorID["@Type"],
          RequestorID: source.RequestorID["@ID"],
        })
    );
  }

  return { thl: thlLogin };
}
