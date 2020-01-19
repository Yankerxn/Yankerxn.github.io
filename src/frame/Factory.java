package frame;

public class Factory<T> {

	/**
	 * 实例Class
	 */
	protected Class<? extends T> instance_class;

	public Factory(Class<? extends T> clazz) {
		instance_class = clazz;
	}

	public T createInstance() {
		try {
			T t = instance_class.newInstance();
			return t;
		} catch (Throwable e) {
			e.printStackTrace();
		}
		return null;
	}

	public Class<? extends T> getInstance_class() {
		return instance_class;
	}

	public void setInstance_class(Class<? extends T> instance_class) {
		this.instance_class = instance_class;
	}

}
