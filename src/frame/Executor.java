package frame;

import java.util.concurrent.ExecutorService;
import java.util.concurrent.ScheduledFuture;
import java.util.concurrent.ScheduledThreadPoolExecutor;
import java.util.concurrent.TimeUnit;

public class Executor {

	protected static Executor instance = new Executor();

	public static Executor getInstance() {
		return instance;
	}

	/**
	 * 定时任务执行者
	 */
	protected final ScheduledThreadPoolExecutor executor = new ScheduledThreadPoolExecutor(
			Runtime.getRuntime().availableProcessors());

	static {
		Runtime.getRuntime().addShutdownHook(new Thread(new Runnable() {
			public void run() {
				Executor.instance.executor.shutdown();
			}
		}));
	}

	public ExecutorService getExecutor() {
		return executor;
	}

	/**
	 * 以固定速率执行周期任务
	 * 
	 * @param runnable
	 *            线程
	 * @param initialDelay
	 *            在initialDelay之后开始执行
	 * @param period
	 *            执行间隔
	 * @param unit
	 *            时间单位
	 * 
	 * @return ScheduledFuture
	 */
	public ScheduledFuture<?> scheduleAtFixedRate(Runnable runnable, long initialDelay, long period, TimeUnit unit) {
		return executor.scheduleAtFixedRate(runnable, initialDelay, period, unit);
	}

	/**
	 * 执行启动延时任务
	 * 
	 * @param runnable
	 *            线程
	 * @param delay
	 *            在delay之后开始执行(单位:毫秒)
	 * @return ScheduledFuture
	 */
	public ScheduledFuture<?> schedule(Runnable runnable, long delay) {
		return executor.schedule(runnable, delay, TimeUnit.MILLISECONDS);
	}

	/**
	 * 启动线程
	 * 线程
	 */
	public void execute(Runnable runnable) {
		executor.execute(runnable);
	}

	/**
	 * 取消定时任务
	 * 
	 * @param scheduled
	 *            任务
	 * @return boolean 是否取消
	 */
	public static boolean cancel(ScheduledFuture<?> scheduled) {
		if (scheduled == null)
			return false;
		return scheduled.cancel(false);
	}

}
