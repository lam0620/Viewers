import { useTranslation } from 'react-i18next';
import React, { useState, useEffect, useRef, forwardRef } from 'react';
import JsBarcode from 'jsbarcode';
import QRCode from 'qrcode.react';
import logo from '../../assets/images/org_logo.png';
import './PdfComponent.css';
import Utils from '../utils';
import Constants from '../constants';


interface PDFReportComponentProps {
  orderData: any;
  reportData: any;
  templateData: any;
}
function Barcode({ value, format = 'CODE128' }) {
  const barcodeRef = useRef(null);

  useEffect(() => {
    if (barcodeRef.current) {
      JsBarcode(barcodeRef.current, value, { format });
    }
  }, [value, format]);

  return <svg ref={barcodeRef} />;
}

const today = new Date();
const day = today.getDate().toString().padStart(2, '0'); // Định dạng ngày có 2 chữ số
const month = (today.getMonth() + 1).toString().padStart(2, '0'); // Định dạng tháng có 2 chữ số (lưu ý tháng bắt đầu từ 0)
const year = today.getFullYear();

const url = window.location.href;
const imageUrl = url.replace('report', 'viewer');

const PDFReportComponent = forwardRef<HTMLDivElement, PDFReportComponentProps>((props, ref) => {
  const { orderData, reportData, templateData } = props;
  const { t } = useTranslation('Report');

  const [sign, setSign] = useState('');

  // Error when select the Print template, fixed by using useEffect()
  // import(`../../assets/signs/` + reportData.radiologist.sign).then((image) =>
  //   setSign(image.default)
  // );

  const margin = "40px";
  const marginTop = "20px"
  const marginBottom = "10px"
  const getPageMargins = () => {
    return `@page { margin: ${marginTop} ${margin} ${marginBottom} ${margin} !important; }`;
    //return `@page {size: A4}`;
  };

  useEffect(() => {
    // const fetchSign = async () => {
    //   const response = await import(`../../assets/signs/${reportData.radiologist.sign}`);
    //   setSign(response.default);
    // };
    // fetchSign();

    // signs are uploaded to /media/signs/... (define in nginx)
    // sign = signs/xxx.yyy
    setSign(Constants.USER_MNG_URL+ reportData.radiologist.sign);
  }, [sign]);


  return (
    <>
      <div className="print-section border" id="pdf-report" ref={ref}>
        <style>{getPageMargins()}</style>

        {/* Header */}
        <div className="header">
          <img src={logo} alt="Logo" />
          <div className="clinic-info mt-0">
            <h3 className="text-red-500 font-bold">{process.env.ORG_NAME}</h3>
            <p style={{ fontSize: '12px' }}>{process.env.ORG_ADDR}</p>
            <p style={{ fontSize: '12px' }}>Hotline: {process.env.ORG_TEL}</p>
          </div>
        </div>
        <div className="title-barcode border">
          <h1 className="title">PHIẾU KẾT QUẢ {Utils.getFullModalityType(orderData.modality_type)}</h1>
          <div className="text-center mr-2 border">
            <div className="barcode">
              <Barcode value={orderData.patient.pid} />
              {/* <Barcode value='1234' /> */}

            </div>
            <div className='translateX'>{orderData.patient.pid}</div>
          </div>
        </div>


        {/* Body */}
        <div className="patient-info">
          <div>
            <p>Họ tên: <span className="font-semibold">{orderData.patient.fullname}</span></p>
            <p>Năm sinh: <span className="font-semibold">{Utils.formatDate(orderData.patient.dob)}</span></p>
            <p>Giới tính: <span className="font-semibold">{Utils.getFullGender_vn(orderData.patient.gender)}</span></p>
          </div>
          <div>
            <p>Địa chỉ: {orderData.patient.address}</p>
            <p className='whitespace-nowrap'>Điện thoại: {orderData.patient.tel}</p>
          </div>
          <p>Chẩn đoán: {orderData.clinical_diagnosis}</p>
          {templateData.value != "0" && (<p>Bác sĩ chỉ định: {orderData.req_phys_name}</p>)}
          <p className="text-red-600">Vùng yêu cầu chụp: {reportData.procedure.name}</p>
          <p className="text-red-600 mt-4">MÔ TẢ HÌNH ẢNH:</p>
          <p className="text-justify" dangerouslySetInnerHTML={{ __html: reportData.findings }}></p>
          <p className="text-red-600 mt-4">Kết luận:</p>
          <p className="text-justify" dangerouslySetInnerHTML={{ __html: reportData.conclusion }}></p>
        </div>

        {/* Footer */}
        <div className='footer flex justify-between items-end'>
          <div className='mb-0 border'>
            <QRCode
              value={imageUrl}
              className='mb-0'
              imageSettings={{
                src: logo,
                excavate: true,
                height: 25,
                width: 25
              }}
            />
          </div>
          <div>
            <div className='text-center mr-4 mb-0 border'>
              <p>Ngày {day} tháng {month} năm {year}</p>
              <p className='font-semibold'>Bác sĩ</p>
              <div className="flex justify-center">
                <img src={sign} alt='Sign' width='150' />
              </div>
              <p className='font-semibold'>{reportData.radiologist.title}. {reportData.radiologist.fullname}</p>
            </div>
          </div>

        </div>
      </div >
    </>
  );
});
export default PDFReportComponent;
