import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Modal,
  Dimensions,
  TouchableWithoutFeedback,
} from "react-native";

interface CalendarProps {
  value?: Date | null;
  onChange?: (date: Date) => void;
  calendarvisible: boolean;
  onClose: () => void;
}

const daysOfWeek = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
const monthNames = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
];

const Calendar: React.FC<CalendarProps> = ({
  value,
  onChange,
  calendarvisible,
  onClose,
}) => {
  const [currentDate, setCurrentDate] = useState(value ?? new Date());
  const [selectedDay, setSelectedDay] = useState<Date | null>(value ?? null);
  const [showYearPicker, setShowYearPicker] = useState(false);
  const [showMonthPicker, setShowMonthPicker] = useState(false);
  const [tempYear, setTempYear] = useState<number | null>(null);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  useEffect(() => {
    if (value) {
      setSelectedDay(value);
      setCurrentDate(value);
    }
  }, [value]);

  const getCalendarMatrix = (year: number, month: number) => {
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const matrix: (number | null)[][] = [];
    let week: (number | null)[] = Array(firstDay).fill(null);

    for (let day = 1; day <= daysInMonth; day++) {
      week.push(day);
      if (week.length === 7) {
        matrix.push(week);
        week = [];
      }
    }

    if (week.length > 0) {
      while (week.length < 7) week.push(null);
      matrix.push(week);
    }

    return matrix;
  };

  const calendar = getCalendarMatrix(year, month);

  const changeMonth = (offset: number) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(month + offset);
    setCurrentDate(newDate);
  };

  const selectDay = (day: number | null) => {
    if (!day) return;
    const newDate = new Date(year, month, day);
    setSelectedDay(newDate);
    onChange?.(newDate);
    onClose();
  };

  const isSelected = (day: number | null) => {
    return (
      selectedDay &&
      day &&
      selectedDay.getFullYear() === year &&
      selectedDay.getMonth() === month &&
      selectedDay.getDate() === day
    );
  };

  const pickYear = (yearPicked: number) => {
    setTempYear(yearPicked);
    setShowYearPicker(false);
    setShowMonthPicker(true);
  };

  const pickMonth = (monthPicked: number) => {
    if (tempYear !== null) {
      const newDate = new Date(tempYear, monthPicked, 1);
      setCurrentDate(newDate);
    }
    setShowMonthPicker(false);
    setTempYear(null);
  };

  return (
    <Modal visible={calendarvisible} transparent animationType="fade">
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.modalBackdrop}>
          <TouchableWithoutFeedback>
            <View style={styles.container}>
              {/* Header */}
              <View style={styles.header}>
                <TouchableOpacity onPress={() => changeMonth(-1)}>
                  <Text style={styles.arrow}>◀</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => setShowYearPicker(true)}>
                  <Text style={styles.month}>
                    {monthNames[month]} {year}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => changeMonth(1)}>
                  <Text style={styles.arrow}>▶</Text>
                </TouchableOpacity>
              </View>

              {/* Weekdays */}
              <View style={styles.row}>
                {daysOfWeek.map((day) => (
                  <Text key={day} style={styles.dayLabel}>
                    {day}
                  </Text>
                ))}
              </View>

              {/* Calendar days */}
              {calendar.map((week, i) => (
                <View key={i} style={styles.row}>
                  {week.map((day, j) => (
                    <TouchableOpacity
                      key={j}
                      style={[
                        styles.dayCell,
                        isSelected(day) && styles.selectedDay,
                      ]}
                      onPress={() => selectDay(day)}
                    >
                      <Text
                        style={[
                          styles.dayText,
                          isSelected(day) && styles.selectedText,
                        ]}
                      >
                        {day || ""}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              ))}

              {/* Year Picker */}
              <Modal visible={showYearPicker} transparent animationType="slide">
                <View style={styles.modalContainer}>
                  <View style={styles.picker}>
                    <ScrollView>
                      {Array.from({ length: 50 }, (_, i) => 2000 + i).map(
                        (y) => (
                          <TouchableOpacity key={y} onPress={() => pickYear(y)}>
                            <Text style={styles.optionText}>{y}</Text>
                          </TouchableOpacity>
                        )
                      )}
                    </ScrollView>
                    <TouchableOpacity onPress={() => setShowYearPicker(false)}>
                      <Text style={styles.closeButtonText}>Cancelar</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </Modal>

              {/* Month Picker */}
              <Modal visible={showMonthPicker} transparent animationType="slide">
                <View style={styles.modalContainer}>
                  <View style={styles.picker}>
                    {monthNames.map((m, i) => (
                      <TouchableOpacity key={i} onPress={() => pickMonth(i)}>
                        <Text style={styles.optionText}>{m}</Text>
                      </TouchableOpacity>
                    ))}
                    <TouchableOpacity onPress={() => setShowMonthPicker(false)}>
                      <Text style={styles.closeButtonText}>Cancelar</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </Modal>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalBackdrop: {
    flex: 1,
    backgroundColor: "#00000066",
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
    width: "90%",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  month: { fontSize: 20, fontWeight: "bold", color: "#333" },
  arrow: { fontSize: 20, color: "#007AFF" },
  row: { flexDirection: "row", justifyContent: "space-between" },
  dayLabel: {
    flex: 1,
    textAlign: "center",
    fontWeight: "600",
    color: "#999",
    marginBottom: 5,
  },
  dayCell: {
    flex: 1,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 4,
    borderRadius: 20,
  },
  selectedDay: {
    backgroundColor: "#007AFF",
  },
  dayText: { fontSize: 16, color: "#333" },
  selectedText: { color: "white", fontWeight: "bold" },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#00000066",
  },
  picker: {
    margin: 30,
    backgroundColor: "white",
    borderRadius: 10,
    maxHeight: 400,
    padding: 20,
  },
  optionText: {
    fontSize: 18,
    padding: 10,
    textAlign: "center",
    color: "#333",
  },
  closeButtonText: {
    marginTop: 10,
    textAlign: "center",
    color: "#007AFF",
    fontWeight: "bold",
  },
});

export default Calendar;
