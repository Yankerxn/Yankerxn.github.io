package frame;

import java.io.File;
import java.io.IOException;
import java.lang.ClassLoader;
import java.lang.reflect.Field;
import java.lang.reflect.Method;
import java.net.URL;
import java.net.URLClassLoader;
import java.util.ArrayList;
import java.util.List;

/**
 * 依赖包加载器
 */
public class JarLoader {

	protected static List<String> jars_path = new ArrayList<String>();

	protected static URLClassLoader urlClassLoader;

	protected static Method addURL;

	static {
		try {
			urlClassLoader = (URLClassLoader) ClassLoader.getSystemClassLoader();
			addURL = URLClassLoader.class.getDeclaredMethod("addURL", new Class[] { URL.class });
			addURL.setAccessible(true);
		} catch (Throwable e) {
			e.printStackTrace();
		}
	}

	public static void load(String libs) throws IOException {
		File file = new File(libs);
		if (file.isDirectory()) {
			File[] files = file.listFiles();
			if (files == null)
				return;
			for (File f : files) {
				String path = f.getPath();
				load(path);
			}
		} else if (file.isFile()) {
			String path = file.getPath();
			if (path.endsWith("jar") || path.endsWith("zip")) {
				loadJar(file.toURI().toURL().toString());
			}
		}
	}

	public static void loadJar(String path) {
		try {
			if (jars_path.contains(path))
				return;
			jars_path.add(path);
			addURL.invoke(urlClassLoader, new URL(path));
			System.out.println("jar load: " + path);
		} catch (Throwable e) {
			e.printStackTrace();
		}
	}

	public static void addusr_paths(String path) {
		try {
			Field field;
			String paths[];
			field = ClassLoader.class.getDeclaredField("usr_paths");
			field.setAccessible(true);
			paths = (String[]) field.get(null);

			for (String string : paths) {
				if (string.equals(path))
					return;
			}

			String[] pathArray = new String[paths.length + 1];
			System.arraycopy(paths, 0, pathArray, 0, paths.length);
			pathArray[paths.length] = path;
			field.set(null, pathArray);
		} catch (Throwable e) {
			e.printStackTrace();
		}
	}

}
