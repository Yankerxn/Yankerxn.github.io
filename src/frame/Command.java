package frame;

/**
 * 命令抽象
 */
public abstract class Command {
	/**
	 * 唯一id
	 */
	protected int id;
	/**
	 * 名称
	 */
	protected String name;
	/**
	 * 父命令
	 */
	protected Command parent;
	/**
	 * 子命令
	 */
	protected Command son;

	/**
	 * 开始执行
	 */
	public void start() {
		initialize();
		execute();
		if (son != null)
			son.start();
		if (parent != null)
			parent.callback();
	}

	/**
	 * 初始化
	 */
	public void initialize() {
	}

	/**
	 * 逻辑初露
	 */
	public void execute() {
	}

	/**
	 * 回调父命令
	 */
	public void callback() {
	}
	
	/**
	 * 休眠
	 */
	public void sleep(long millis) {
		try {
			Thread.sleep(millis);
		} catch (Throwable e) {
			e.printStackTrace();
		}
	}

}
