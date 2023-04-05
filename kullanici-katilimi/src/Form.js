import "./App";
import { useState, useEffect } from "react";
import * as Yup from "yup";
import axios from "axios";

const initalFormData = {
  isimDegeri: "",
  soyIsimDegeri: "",
  email: "",
  password: "",
  kullanimSarti: [],
};

// YUP
const formSchema = Yup.object().shape({
  isimDegeri: Yup.string()
    .required("İsim alanı zorunludur")
    .min(3, "İsim en az 3 karakter olmalı"),
  soyIsimDegeri: Yup.string()
    .required("Soy İsim de zorunludur")
    .min(2, "İsim en az 2 karakter olmalı"),
  email: Yup.string()
    .required("olmazsa olmaz")
    .email("gecerli bir email formati gereklidir"),
  password: Yup.string()
    .required("sifre giriniz")
    .matches(
      /^(?=.*[A-Z])(?=.*[!@#$&*])(?=.{8,})/,
      "1 uppercase, 1 ozel karakter icermeli"
    )
    .max(8, "Şifre en fazla 8 karakter olmalıdır"),
  kullanimSarti: Yup.array().min(1, "Kullanım Şartları kabul edilmeli"),
});

export default function Form() {
  const [formData, setFormData] = useState(initalFormData);
  const [buttonDisabledMi, setButtonDisabledMi] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  const [errors, setErrors] = useState({
    isimDegeri: "",
    soyIsimDegeri: "",
    email: "",
    password: "",
    kullanimSarti: "",
  });

  useEffect(() => {
    formSchema.isValid(formData).then((valid) => setButtonDisabledMi(!valid));
  }, [formData]);

  // YUP
  const handleReset = () => {
    setFormData(initalFormData);
  };

  const checkFormErrors = (name, value) => {
    Yup.reach(formSchema, name)
      .validate(value)
      .then(() => {
        setErrors({
          ...errors,
          [name]: "",
        });
      })
      .catch((err) => {
        setErrors({
          ...errors,
          [name]: err.errors[0],
        });
      });
  };
  // YUP

  function handleChange(event) {
    const { value, type, name } = event.target;

    if (type === "checkbox") {
      let yeniKullanimSarti;
      if (formData.kullanimSarti.includes(value)) {
        yeniKullanimSarti = formData.kullanimSarti.filter((m) => m !== value);
      } else {
        yeniKullanimSarti = [...formData.kullanimSarti, value];
      }
      checkFormErrors(name, yeniKullanimSarti); // YUP
      setFormData({
        ...formData,
        [name]: yeniKullanimSarti,
      });
    } else {
      checkFormErrors(name, value); // YUP
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  }

  function handleSubmit(event) {
    event.preventDefault();
    console.log(formData);
  }

  function handleSubmit(event) {
    event.preventDefault();

    // Create an object containing the form data
    const postData = {
      isimDegeri: formData.isimDegeri,
      soyIsimDegeri: formData.soyIsimDegeri,
      email: formData.email,
      password: formData.password,
      kullanimSarti: formData.kullanimSarti,
    };

    // Send a POST request to the API with axios
    axios
      .post("https://reqres.in/api/users", postData)
      .then((response) => console.log(response.data))
      .catch((error) => console.error(error));
  }

  return (
    <div className="App">
      <form onSubmit={handleSubmit}>
        <div className="form-line">
          <label htmlFor="isimAlani">İsim</label>
          <input
            onChange={handleChange}
            type="text"
            value={formData.isimDegeri}
            id="isimAlani"
            name="isimDegeri"
          />
          {errors.isimDegeri !== "" && (
            <div className="field-error">{errors.isimDegeri}</div>
          )}
        </div>

        <div className="form-line">
          <label htmlFor="SoyisimAlani">Soyisim</label>
          <input
            onChange={handleChange}
            type="text"
            value={formData.soyIsimDegeri}
            id="SoyisimAlani"
            name="soyIsimDegeri"
          />
          {errors.soyIsimDegeri !== "" && (
            <div className="field-error">{errors.soyIsimDegeri}</div>
          )}
        </div>

        <div className="form-line">
          <label htmlFor="emailAlani">Email</label>
          <input
            onChange={handleChange}
            type="text"
            value={formData.email}
            id="emailAlani"
            name="email"
          />
          {errors.email !== "" && (
            <div className="field-error">{errors.email}</div>
          )}
        </div>

        <div className="form-line">
          <label htmlFor="sifreAlani">Sifre</label>
          <input
            onChange={handleChange}
            type={showPassword ? "text" : "password"}
            value={formData.password}
            id="sifreAlani"
            name="password"
            onFocus={() => setShowPassword(true)}
            onBlur={() => setShowPassword(false)}
          />
          {errors.password !== "" && (
            <div className="field-error">{errors.password}</div>
          )}
        </div>

        <div className="form-line">
          <label>Kullanim sartlari</label>
          <label>
            <input
              onChange={handleChange}
              type="checkbox"
              name="kullanimSarti"
              value=""
              checked={formData.kullanimSarti.includes("")}
            />
          </label>
          {errors.kullanimSarti !== "" && (
            <div className="field-error">{errors.kullanimSarti}</div>
          )}
        </div>
        <div className="form-line">
          <button type="reset" onClick={handleReset}>
            Formu temizle
          </button>
          <button type="submit" disabled={buttonDisabledMi}>
            Gönder
          </button>
        </div>
      </form>
    </div>
  );
}
