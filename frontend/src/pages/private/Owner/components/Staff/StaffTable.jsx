import React from "react";
import StaffRow from "./StaffRow";
import Pagination from "../shared/Pagination";

const StaffTable = ({
  staff = [],
  page = 1,
  pageSize = 10,
  total = 0,
  onPageChange,
  onPageSizeChange,
  handlers,
}) => {
  const headers = [
    "Mã",
    "Họ tên",
    "Liên hệ",
    "Chức vụ",
    "Lương",
    "Ngày vào làm",
    "Trạng thái",
    "Hiệu suất",
    "Đăng nhập cuối",
    "Hành động",
  ];

  return (
    <div
      style={{
        background: "#fff",
        borderRadius: 12,
        boxShadow: "0 6px 20px rgba(0,0,0,.06)",
      }}
    >
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#f9fafb", textAlign: "left" }}>
              {headers.map((h) => (
                <th
                  key={h}
                  style={{
                    padding: 12,
                    fontSize: 13,
                    color: "#6b7280",
                    borderBottom: "1px solid #e5e7eb",
                    fontWeight: 600,
                  }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {staff.length === 0 ? (
              <tr>
                <td colSpan={10} style={{ padding: 32, textAlign: "center", color: "#6b7280" }}>
                  <div style={{ fontSize: 16, marginBottom: 8 }}>👥</div>
                  Không có dữ liệu nhân viên
                </td>
              </tr>
            ) : (
              staff.map((s) => <StaffRow key={s.id} staff={s} handlers={handlers} />)
            )}
          </tbody>
        </table>
      </div>

      {staff.length > 0 && (
        <Pagination
          page={page}
          pageSize={pageSize}
          total={total}
          onPageChange={onPageChange}
          onPageSizeChange={onPageSizeChange}
          itemsLabel="nhân viên"
        />
      )}
    </div>
  );
};

export default StaffTable;

