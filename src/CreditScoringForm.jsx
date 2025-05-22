import React, { useState } from "react";
import axios from "axios";

const scoringSchema = {
  Character: {
    "Tiểu sử cá nhân": ["Tốt", "Từng có tiền án tiền sự"],
    "Đánh giá mối quan hệ của người gọi vốn đối với cộng đồng": [
      "Có uy tín",
      "Bình thường",
      "Không tốt",
    ],
    "Quan hệ với các TCTD": [
      "Trả nợ đúng hạn",
      "Chưa có thông tin",
      "Từng bị cơ cấu nợ",
      "Từng có nợ quá hạn, nợ xấu",
      "Đang có nợ quá hạn",
    ],
    "Tình hình trả nợ tại VNFITE": [
      "Luôn trả đúng hạn",
      "Chưa có QHTD",
      "Từng có nợ quá hạn và đã trả hết",
      "Có nợ quá hạn/Cơ cấu nợ",
    ],
    "Tình hình quan hệ với VNFITE": [
      "Từ 3 năm trở lên",
      "Từ 2-3 năm",
      "Từ 1-2 năm",
      "Dưới 1 năm",
      "Chưa có quan hệ",
    ],
  },
  Capacity: {
    "Tuổi": [
      "Từ 30-50 tuổi",
      "Từ 25-29 tuổi hoặc 51-55 tuổi",
      "Từ 56-60 tuổi",
      "Từ 20-24 tuổi",
      "Từ 61 tuổi trở lên hoặc 18-19 tuổi",
    ],
    "Trình độ học vấn": ["Đại học/trên đại học", "Cao đẳng", "Trung cấp", "Dưới trung cấp"],
    "Tình trạng hôn nhân": ["Có gia đình", "Chưa lập gia đình", "Ly dị/góa", "Khác (ly thân)"],
    "Năng lực pháp luật dân sự và hành vi dân sự của người thân": ["Đủ", "Không đủ"],
    "Tính chất công việc hiện tại": [
      "Cán bộ quản lý",
      "Cán bộ cấp chuyên viên",
      "Lao động được đào tạo nghề/công nhân hoặc kinh doanh tự do",
      "Lao động thời vụ/thất nghiệp/nghỉ hưu",
    ],
    "Thâm niên làm việc trong lĩnh vực chuyên môn hiện tại": [
      "Từ 5 năm trở lên",
      "Từ 4-5 năm",
      "Từ 3-4 năm",
      "Từ 1-3 năm",
      "Dưới 1 năm",
    ],
    "Thời gian công tác tại nơi làm việc": ["Từ 3 năm trở lên", "Từ 1-3 năm", "Dưới 1 năm"],
  },
  Capital: {
    "Rủi ro nghề nghiệp": ["Rất thấp", "Thấp", "Trung bình", "Tương đối cao", "Cao"],
    "Số người phụ thuộc": ["Dưới 3 người", "3 người", "4 người", "5 người", "Trên 5 người"],
    "Cơ cấu gia đình": ["Gia định hạt nhân", "Sống chung với bố mẹ", "Sống chung với gia định hạt nhân khác", "Các trường hợp khác"],
    "Đánh giá về gia cảnh của khách hàng": ["Tốt", "Xấu"],
    "Tổng thu nhập hàng tháng của người gọi vốn": [
      "Cao (trên 50 trđ)",
      "Khá (từ 25-50 trđ)",
      "Trung bình (từ 10-25 trđ)",
      "Thấp (dưới 10 trđ)",
    ],
    "Mức thu nhập ròng ổn định hàng tháng của người gọi vốn": [
      "Cao (trên 30 trđ)",
      "Khá (từ 15-30 trđ)",
      "Trung bình (từ 05-15 trđ)",
      "Thấp (dưới 05 trđ)",
    ],
    "Tỷ lệ giữa thu nhập ròng ổn định và sổ tiền phải trả trong kỳ theo kế hoạch trả nợ": [
      "3",
      "2",
      "1",
      "< 1",
    ],
  },
  Collateral: {
    "Giá trị hợp đồng bảo hiểm nhân thọ (nếu có) so với dư nợ": [
      "Trên 100%",
      "Từ 50%-100%",
      "Từ 30%-50%",
      "Dưới 30%",
      "Không có",
    ],
    "Tiền gửi tiết kiệm": ["Có tiền gửi", "Không có thông tin", "Không có tiền gửi"],
    "Tình trạng chỗ ở hiện tại": ["Nhà riêng sở hữu", "Ở chung cùng bố mẹ", "Nhà đi thuê", "Khác"],
    "Thời gian lưu trú trên địa bàn hiện tại": [
      "Từ 7 năm trở lên",
      "Từ 5-7 năm",
      "Từ 3-5 năm",
      "Từ 1-3 năm",
      "Dưới 1 năm",
    ],
    "Sở hữu ô tô": [
      "Xe cao cấp (giá trị trên 1 tỷ)",
      "Xe phổ thông (giá trị từ 500 trđ dưới 1 tỷ)",
      "Xe phổ thông (giá trị dưới 500 trđ)",
      "Không sở hữu xe ô tô",
    ],
  },
  Conditions: {
    "Mục đích vay vốn": ["Tiêu dùng cá nhân", "Thanh toán hóa đơn điện nước, internet", "Thanh toán học phí", "Khác"],
    "Thông tin mạng xã hội": ["Thông tin tốt", "Bình thường", "Thông tin xấu", "Không tham gia mạng xã hội"],
    "Số tiền điện thoại hàng tháng": [
      "Trên 1.000.000 VNĐ",
      "Từ 500.000-1.000.000 VNĐ",
      "Từ 300.000-500.000 VNĐ",
      "Từ 100.000-300.000 VNĐ",
      "Dưới 100.000 VNĐ",
    ],
    "Số điện thoại hay gọi, mục đích": ["Gia đình", "Bạn bè", "Công việc", "Khác"],
    "Hội nhóm tham gia trên các trang mạng xã hội": [
      "Giáo dục, kinh tế, xã hội",
      "Thể thao, giải trí",
      "Mua sắm",
      "Khác",
    ],
  },
};

export default function CreditScoringForm() {
    const [formData, setFormData] = useState({
      Character: {}, Capacity: {}, Capital: {}, Collateral: {}, Conditions: {},
    });
    const [result, setResult] = useState(null);
    const [errorMsg, setErrorMsg] = useState("");
  
    const handleChange = (category, criterion, value) => {
      setFormData(prev => ({
        ...prev,
        [category]: {
          ...prev[category],
          [criterion]: value
        }
      }));
      setErrorMsg("");
    };
  
    // Hàm kiểm tra xem đã chọn hết chưa
    const isFormComplete = () => {
      return Object.entries(scoringSchema).every(([category, criteria]) =>
        Object.keys(criteria).every(criterion =>
          formData[category] && formData[category][criterion] && formData[category][criterion] !== ""
        )
      );
    };
  
    const handleSubmit = async () => {
      if (!isFormComplete()) {
        setErrorMsg("Vui lòng chọn đầy đủ tất cả các tiêu chí trước khi tính điểm!");
        return;
      }
  
      try {
        const response = await axios.post('http://lamgs.io.vn/calculate-score', formData);
        setResult(response.data);
        setErrorMsg("");
      } catch (err) {
        console.error('Error calculating score', err);
        setErrorMsg("Lỗi khi gửi dữ liệu. Vui lòng thử lại sau.");
      }
    };
  
    return (
      <div className="min-h-screen bg-gradient-to-r from-blue-100 via-blue-50 to-white font-sans p-8">
        <header className="max-w-5xl mx-auto mb-14 text-center">
          <h1 className="text-4xl font-extrabold text-blue-900 drop-shadow-md tracking-wide">
            🏦 Hệ Thống Chấm Điểm Tín Dụng
          </h1>
          <p className="mt-2 text-blue-700 text-lg font-medium">Cung cấp đánh giá chính xác & minh bạch</p>
        </header>
  
        <main className="max-w-5xl mx-auto bg-white rounded-3xl shadow-2xl p-10 space-y-12">
          {Object.entries(scoringSchema).map(([category, criteria]) => (
            <section key={category} className="border border-blue-300 rounded-2xl p-8">
              <h2 className="text-2xl font-semibold text-blue-800 border-b border-blue-300 pb-3 mb-8">{category}</h2>
              <div className="flex flex-col gap-8">
                {Object.entries(criteria).map(([criterion, options]) => (
                  <div key={criterion} className="flex items-center justify-between gap-6">
                    <label 
                      htmlFor={`${category}-${criterion}`} 
                      className="w-1/3 text-gray-700 font-semibold text-lg"
                    >
                      {criterion}
                    </label>
                    <select
                      id={`${category}-${criterion}`}
                      className="w-2/3 px-5 py-3 border border-gray-300 rounded-xl shadow-sm text-gray-900 text-lg
                        focus:outline-none focus:ring-4 focus:ring-blue-400 focus:border-blue-600 transition"
                      onChange={(e) => handleChange(category, criterion, e.target.value)}
                      value={formData[category][criterion] || ""}
                    >
                      <option value="" disabled>-- Chọn một tùy chọn --</option>
                      {options.map(option => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </select>
                  </div>
                ))}
              </div>
            </section>
          ))}
  
          {errorMsg && (
            <p className="text-center text-red-600 font-semibold mb-4">{errorMsg}</p>
          )}
  
          <div className="text-center mt-6">
            <button
              onClick={handleSubmit}
              disabled={!isFormComplete()}
              className={`text-white text-xl font-bold px-10 py-4 rounded-full shadow-lg
                transition duration-300
                ${isFormComplete()
                  ? "bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 cursor-pointer"
                  : "bg-gray-400 cursor-not-allowed"
                }`}
            >
              🚀 Tính điểm tín dụng
            </button>
          </div>
  
          {result && (
            <div className="mt-10 max-w-xl mx-auto bg-green-50 border border-green-300 rounded-2xl p-8 text-center shadow-lg">
              <h2 className="text-2xl font-extrabold text-green-700 mb-4">🎉 Kết quả chấm điểm</h2>
              {result.totalScore >= 0 ? (
                <>
                  <p className="text-xl text-gray-900 mb-2">
                    Điểm tổng: <span className="font-bold text-green-800">{result.totalScore}</span>
                  </p>
                  <p className="text-lg text-gray-700">
                    Xếp hạng: <span className="font-semibold text-green-900">{result.rating}</span>
                  </p>
                </>
              ) : (
                <p className="text-red-600 font-semibold">{result.error.join(", ")}</p>
              )}
            </div>
          )}
        </main>
      </div>
    );
}
  