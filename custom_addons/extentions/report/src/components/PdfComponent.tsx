import React, { useEffect, useRef, forwardRef } from 'react';
import JsBarcode from 'jsbarcode';
import QRCode from 'qrcode.react';
import logo from '../../assets/images/logo.png';
import icon_test from '../../assets/images/icon_test.png';

interface PDFReportComponentProps {
  statePID: any;
  stateName: any;
  stateDOB: any;
  stateSex: any;
  stateIndication: any;
  stateDoctorName: any;
  findings: string;
  impression: string;
  ref: any;
  service: any;
  address: any;
  radiologist: any;
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
const newUrl = url.replace('report', 'viewer');

const PDFReportComponent = forwardRef<HTMLDivElement, PDFReportComponentProps>((props, ref) => {
  const { statePID, stateName, stateDOB, stateSex, stateIndication, stateDoctorName, findings, impression, service, address, radiologist } = props;

  return (
    <>
      <div className="container" id="pdf-report" ref={ref}>
        <div className="header">
          <img src={logo} alt="Logo" />
          <div className="clinic-info">
            <h2>PHÒNG KHÁM ĐA KHOA VIỆT GIA</h2>
            <h4>166 Nguyễn Văn Thủ, ĐaKao, Quận 1, Tp.Hồ Chí Minh</h4>
            <h4>Hotline: 028 39 115 115 - 028 39 115 116</h4>
          </div>
        </div>
        <div className="title-barcode">
          <h1 className="title">PHIẾU KẾT QUẢ</h1>
          <div className="barcode">
            <Barcode value={statePID} />
          </div>
        </div>
        <div className="patient-info">
          <div>
            <p>Họ tên: <span className="bold">{stateName}</span></p>
            <p style={{ marginLeft: '70px' }}>Năm sinh: <span className="bold">{stateDOB}</span></p>
            <p style={{ marginLeft: '70px' }}>Giới tính: <span className="bold">{stateSex}</span></p>
          </div>
          <div>
            <p>Địa chỉ: {address}</p>
            <p style={{ marginLeft: '50px' }}>Điện thoại: 0999991111</p>
          </div>
          <p>Chẩn đoán: {stateIndication}</p>
          <p>Bác sĩ chỉ định: {stateDoctorName}</p>
          <p className="red">Vùng yêu cầu chụp: {service}</p>
          <p className="red underline">Mô tả hình ảnh:</p>
          <div className="findings" dangerouslySetInnerHTML={{ __html: findings }}></div>
          <p className="red underline">Kết luận:</p>
          <div className="impression" dangerouslySetInnerHTML={{ __html: impression }}></div>
        </div>
        <div style={{ position: 'absolute', bottom: '65px', right: '60px', display: 'flex', flexDirection: 'column', textAlign: 'center' }}>
          <p>Ngày {day} tháng {month} năm {year}</p>
          <p style={{ fontWeight: 'bold', marginBottom: '140px' }}>Bác sĩ</p>
          <p>{radiologist}</p>
        </div>
        <div className="qrcode">
          <QRCode
            value={newUrl}
            imageSettings={{
              src: icon_test,
              excavate: true,
              height: 25,
              width: 25
            }}
          />
        </div>
      </div>
    </>
  );
});
export default PDFReportComponent;
