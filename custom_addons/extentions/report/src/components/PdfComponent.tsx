import { useTranslation } from 'react-i18next';
import React, { useState, useEffect, useRef, forwardRef } from 'react';
import JsBarcode from 'jsbarcode';
import QRCode from 'qrcode.react';
import logo from '../../assets/images/logo.png';
import './PdfComponent.css';
import Utils from '../utils';

interface PDFReportComponentProps {
  orderData: any;
  reportData: any;
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
  const { orderData, reportData } = props;
  const { t } = useTranslation('Report');

  const [sign, setSign] = useState('');
  import(`../../assets/signs/` + reportData.radiologist.sign).then((image) =>
    setSign(image.default)
  );

  const margin = "40px";
  const marginTop = "20px"
  const marginBottom = "30px"
  const getPageMargins = () => {
    return `@page { margin: ${marginTop} ${margin} ${marginBottom} ${margin} !important; }`;
    //return `@page {size: A4}`;
  };

  return (
    <>
      <div className="print-section border" id="pdf-report" ref={ref}>
        <style>{getPageMargins()}</style>

        {/* Header */}
        <div className="header">
          <img src={logo} alt="Logo" />
          <div className="clinic-info mt-0">
            <h3 className="text-red-500 font-bold">PHÒNG KHÁM ĐA KHOA VIỆT GIA</h3>
            <p style={{ fontSize: '12px' }}>166 Nguyễn Văn Thủ, ĐaKao, Quận 1, Tp.Hồ Chí Minh</p>
            <p style={{ fontSize: '13px' }}>Hotline: 028 39 115 115 - 028 39 115 116</p>
          </div>
        </div>
        <div className="title-barcode">
          <h1 className="title">PHIẾU KẾT QUẢ {Utils.getFullModalityType(orderData.modality_type)}</h1>
          <div className="text-center mr-2">
            <div className="barcode">
              <Barcode value={orderData.patient.pid} />
              {/* <Barcode value='1234' /> */}

            </div>
            <div>{orderData.patient.pid}</div>
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
            <p>Điện thoại: {orderData.patient.tel}</p>
          </div>
          <p>Chẩn đoán: {orderData.clinical_diagnosis}</p>
          <p>Bác sĩ chỉ định: {orderData.req_phys_name}</p>
          <p className="text-red-600">Vùng yêu cầu chụp: {reportData.procedure.name}</p>
          <p className="text-red-600 mt-4">MÔ TẢ HÌNH ẢNH:</p>
          <p className="text-justify" dangerouslySetInnerHTML={{ __html: reportData.findings }}></p>
          <p className="text-red-600 mt-4">Kết luận:</p>
          <p className="text-justify" dangerouslySetInnerHTML={{ __html: reportData.conclusion }}></p>
        </div>

        {/* Footer */}
        <div className='page-break'></div>
        <div className='footer flex justify-between'>
          <div className="qrcode">
            <QRCode
              value={imageUrl}
              imageSettings={{
                src: logo,
                excavate: true,
                height: 25,
                width: 25
              }}
            />
          </div>
          <div>
            <div className='sign text-center mr-4 border'>
              <p>Ngày {day} tháng {month} năm {year}</p>
              <p className='font-semibold'>Bác sĩ</p>
              <div className="flex justify-center">
                <img src={sign} alt='Sign' />
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
