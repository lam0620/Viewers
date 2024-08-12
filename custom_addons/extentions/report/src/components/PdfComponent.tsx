import { useTranslation } from 'react-i18next';
import React, { useState, useEffect, useRef, forwardRef } from 'react';
import JsBarcode from 'jsbarcode';
import QRCode from 'qrcode.react';
import logo from '../../assets/images/logo.png';

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

  return (
    <>
      <div className="container" id="pdf-report" ref={ref}>
        {/* Header */}
        <div className="header">
          <img src={logo} alt="Logo" />
          <div className="clinic-info">
            <h3 style={{ color: 'red', fontWeight: 'bold' }}>PHÒNG KHÁM ĐA KHOA QUỐC TẾ VIỆT HEALTHCARE</h3>
            <h4>16 - 18 Lý Thường Kiệt, Phường 7, Quận 10, Tp. Hồ Chí Minh</h4>
            <h4>Hotline: 09 0133 0133 - 028 9999 2899</h4>
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
            <p>Họ tên: <span className="bold">{orderData.patient.fullname}</span></p>
            <p style={{ marginLeft: '70px' }}>Năm sinh: <span className="bold">{Utils.formatDate(orderData.patient.dob)}</span></p>
            <p style={{ marginLeft: '70px' }}>Giới tính: <span className="bold">{Utils.getFullGender_vn(orderData.patient.gender)}</span></p>
          </div>
          <div>
            <p>Địa chỉ: {orderData.patient.address}</p>
            <p style={{ marginLeft: '50px' }}>Điện thoại: {orderData.patient.tel}</p>
          </div>
          <p>Chẩn đoán: {orderData.clinical_diagnosis}</p>
          <p>Bác sĩ chỉ định: {orderData.req_phys_name}</p>
          <p className="red">Vùng yêu cầu chụp: {reportData.procedure.name}</p>
          <p className="red underline">Mô tả hình ảnh:</p>
          <div className="findings" dangerouslySetInnerHTML={{ __html: reportData.findings }}></div>
          <p className="red underline">Kết luận:</p>
          <div className="conclusion" dangerouslySetInnerHTML={{ __html: reportData.conclusion }}></div>
        </div>
        {/* Footer */}
        <div className='footer'>
          <div style={{ position: 'absolute', bottom: '65px', right: '60px', display: 'flex', flexDirection: 'column', textAlign: 'center' }}>
            <p>Ngày {day} tháng {month} năm {year}</p>
            <p style={{ fontWeight: 'bold', marginBottom: '140px' }}>Bác sĩ</p>
            <img src={sign} alt='Sign' />
            <p>{reportData.radiologist.fullname}</p>
          </div>
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
        </div>
      </div >
    </>
  );
});
export default PDFReportComponent;
