import logo from './logo.svg';
import './App.css';
import { useState } from 'react';
import { toast } from 'react-toastify';
import Select from 'react-select'

const options = [
  { value: 'Visa', label: 'Visa' },
  { value: 'MasterCard', label: 'MasterCard' },
  { value: 'NewsPlus', label: 'NewsPlus' }
]


function App() {

  const url = 'http://localhost:8080/api/trip'

  const [username, setusername] = useState("")
  const [trips, settrips] = useState([])
  const [isPaid, setisPaid] = useState(true)
  const [totalMoney, settotalMoney] = useState(-1)

  const [name, setName] = useState("")
  const [type, setType] = useState("")
  const [cardNumber, setCardNumber] = useState("")
  const [cvc, setCvc] = useState("")
  const [expirationDate, setexpirationDate] = useState("")

  const onClickFindTrips = () => {
    if(username == null || username.length == 0) {
      toast.warn("Làm ơn nhập username trước khi tìm kiếm")
    } else {
        fetch(url + '/find-all/' + username)
          .then(res => res.json())
          .then(data => {
            console.log(data);
            settrips(data)
            if(data.length == 0) {
              toast.warn(`Không tìm thấy chuyến đi nào với user: ${username}`)
            } else {
              settotalMoney(data.reduce((a, b) => a + b.price, 0));
              setisPaid(data[0].paid);
            }
          }) 
          .catch(error => toast.error(error))
    }
  }

  const handleClickPayment = () => {
    
    if(name.length == 0) {
      toast.warn("Vui lòng nhập tên chủ thẻ");
      return
    }

    if(type.length == 0) {
      toast.warn("Vui lòng chọn loại thẻ");
      return
    }

    if(cardNumber.length == 0) {
      toast.warn("Vui lòng nhập số thẻ");
      return
    }

    if(cvc.length == 0) {
      toast.warn("Vui lòng nhập số cvc");
      return
    }

    if(expirationDate.length == 0) {
      toast.warn("Vui lòng nhập thời gian hết hạn");
      return
    }

    let data = {name, type, cardNumber, cvc, expirationDate, money: totalMoney}

    fetch(url + "/payment/" + username, {
      method: "POST", 
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Success:", data);
        if(data.code == 200) {
          toast.success(data.message)
          onClickFindTrips()
        } else if(data.code >= 400 && data.code < 500) {
          toast.warn(data.message)
        } else {
          toast.error(data.message)
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
      }

  return (
    <section className="vh-100">
        <div className="container mt-4">
            <div className="input-group mb-3">
                <input type="text" className="form-control" value={username} onChange={(t) => setusername(t.target.value)} name="username" placeholder="Payment's username" aria-label="Payment's username" aria-describedby="basic-addon2" />
                <div className="input-group-append">
                  <button className="btn btn-outline-primary" onClick={onClickFindTrips}  data-target="#collapseExample" aria-expanded="true" aria-controls="collapseExample">
                        Xem chuyến đi
                  </button>
                </div>
            </div>
            { trips && trips.length > 0 &&
                <div className="collapse show" id="collapseExample">
                    <div className="card card-body">
                        <p>Chuyến đi của: {username}
                        </p>
                        <ul className="list-group">
                          {
                            trips && trips.map((t, i) => {
                              return  <li className="list-group-item d-flex justify-content-between align-items-center" key={i}>
                                Chuyến đi: {t.address} Trong {t.duration} ngày
                                <span className="badge badge-primary badge-pill">${t.price}</span>
                            </li>
                            })
                          }

                            <li className="list-group-item d-flex justify-content-between align-items-center">
                                Tổng tiền
                                <span className="badge badge-primary badge-pill">$
                                  {totalMoney}
                                </span>
                            </li>
                            <li className="list-group-item d-flex justify-content-between align-items-center">
                               {
                                 isPaid ? 
                                  <div className="alert alert-success alert-dismissible fade show">
                                      <strong>Đã thanh toán</strong>
                                  </div> :  
                                  <div className="alert alert-danger alert-dismissible fade show">
                                      <strong>Chưa thanh toán</strong>
                                  </div>
                               } 
                                    
                                   
                                    
                                    
                            </li>
                        </ul>
                    </div>
                    { !isPaid &&
                        <div className="card card-body mt-4">
                            <div className="form-holder">
                                <div className="form-content">
                                    <div className="form-items">
                                        <div  className="requires-validation" >
                                            <h1 className="mb-3 text-center" style={{color : "#17a2b8"}}>THANH TOÁN</h1>

                                            <div className="form-outline mb-2">
                                                <label htmlFor="tenChuThe" className="form-label">Tên chủ thẻ:</label>
                                                <input type="text" name="name" value={name} onChange={(t) => setName(t.target.value)}  className="form-control form-control-lg"
                                                      placeholder="nhập tên chủ thẻ" required />
                                                <div className="valid-feedback"></div>
                                                <div className="invalid-feedback">Vui lòng điền đầy đủ thông tin</div>
                                            </div>


                                            <div className="form-outline mb-2">
                                                <label htmlFor="kieuThe" className="form-label">Kiểu thẻ:</label>
                                                {/* <select className="form-select" value={type} onChange={(t) => {console.log(t); setType(t.target.value)}} id="kieuThe" name="type">
                                                    <option>Visa</option>
                                                    <option>MasterCard</option>
                                                    <option>NewsPlus</option>
                                                </select> */}
                                                <Select onChange={(t) => {console.log(t); setType(t.value)}}  options={options} />
                                            </div>

                                            <div className="form-outline mb-2">
                                                <label htmlFor="soThe" className="form-label">Số thẻ:</label>
                                                <input type="text" name="cardNumber" value={cardNumber} onChange={(t) => setCardNumber(t.target.value)} className="form-control form-control-lg"
                                                placeholder="nhập số thẻ"  required />
                                                <div className="valid-feedback"></div>
                                                <div className="invalid-feedback">Vui lòng điền đầy đủ thông tin</div>
                                            </div>

                                            <div className="form-outline mb-2">
                                                <label htmlFor="soCVC" className="form-label">Số CVC:</label>
                                                <input type="text" name="cvc" value={cvc} onChange={(t) => setCvc(t.target.value)} className="form-control form-control-lg"
                                                placeholder="nhập số CVC"  required />
                                                <div className="valid-feedback"></div>
                                                <div className="invalid-feedback">Vui lòng điền đầy đủ thông tin</div>
                                            </div>

                                            <div className="form-outline mb-2">
                                                <label htmlFor="thangNamHetHan" className="form-label">Nhập tháng năm hết hạn:</label>
                                                <input type="text" name="expirationDate" value={expirationDate} onChange={(t) => setexpirationDate(t.target.value)} className="form-control form-control-lg"
                                                      placeholder="nhập tháng năm hết hạn" required />
                                                <div className="valid-feedback"></div>
                                                <div className="invalid-feedback">Vui lòng điền đầy đủ thông tin</div>
                                            </div>
                                            <input type="hidden" name="totalMoney" value="${totalPrice}" />
                                            <input type="hidden" name="username" value="${username}" />
                                            <div className="text-center text-lg-start mt-4 pt-2">
                                                <button onClick={handleClickPayment} type="submit" className="btn btn-info btn-lg"
                                                        style={{paddingLeft: "2.5rem", paddingRight: "2.5rem", width: "490px"}}>Thanh toán</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    }
                </div>
            }
            
        </div>
    </section>
  );
}

export default App;
