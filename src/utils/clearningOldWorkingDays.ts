import WorkDay from "../models/WorkDay";
import { formatDate } from "../utils/formatDate";

export const cleanOldWorkingDays = async () => {
    const date = new Date();
    const today = formatDate(date);

    try {
        const result = await WorkDay.deleteMany({
            date: { $lt: today },
        });
        console.log(`🧹 Deleted ${result.deletedCount} outdated working days.`);
    } catch (error) {
        console.error("❌ Error cleaning outdated working days:", error);
    }
};
