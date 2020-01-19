package frame;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.net.URI;
import java.net.URISyntaxException;
import java.net.URL;
import java.util.*;
import java.util.zip.ZipEntry;
import java.util.zip.ZipInputStream;

/**
 * Class加载器
 * 
 */
public class ClassLoader {

	public static final List<Class<?>> CLASSES = new ArrayList<Class<?>>(200);

	private static final Map<Class<?>, List<Class<?>>> SUB_CLASSES_MAP = new HashMap<Class<?>, List<Class<?>>>();

	private static boolean isLoad;

	public synchronized static void loadClassesFromPath() {
		if (!isLoad) {
			try {
				URL resource = java.lang.ClassLoader.getSystemResource("");
				if (resource == null)
					resource = ClassLoader.class.getResource("");
				URI uri = resource.toURI();
				if (String.valueOf(uri).indexOf("jar!") > 0) {
					resource = ClassLoader.class.getProtectionDomain().getCodeSource().getLocation();
					uri = resource.toURI();
				}
				String property = new File(uri).getPath();
				String[] paths = property.split(";");
				for (String path : paths) {
					File file = new File(path);
					if (file.isFile() && path.endsWith(".jar")) {
						listClassesInZip(file, "/");
					} else if (file.isDirectory()) {
						listClassesInDirectory(path + File.separatorChar, file);
					}
				}
			} catch (URISyntaxException e) {
			}
		}
	}

	private synchronized static void listClassesInDirectory(String rootPath, File file) {
		File[] subFiles = file.listFiles();
		if (subFiles == null)
			return;
		for (File subFile : subFiles) {
			if (subFile.canRead()) {
				if (subFile.isFile()) {
					String path = subFile.getPath();
					if (path.endsWith(".class")) {
						try {
							String className = getClassName(path.substring(rootPath.length()));
							CLASSES.add(Class.forName(className));
						} catch (Throwable e) {
						}
					} else if (path.endsWith(".jar")) {
						listClassesInZip(subFile, "/");
					}
				} else if (subFile.isDirectory()) {
					listClassesInDirectory(rootPath, subFile);
				}
			}
		}
	}

	private synchronized static void listClassesInZip(File jarFile, String specPath) {
		ZipInputStream in = null;
		try {
			in = new ZipInputStream(new FileInputStream(jarFile));
			ZipEntry ze = null;
			while ((ze = in.getNextEntry()) != null) {
				if (ze.isDirectory()) {
					continue;
				} else {
					try {
						String name = ze.getName();
						if (!name.endsWith(".class"))
							continue;
						if (specPath.substring(1).length() > 0 && name.indexOf(specPath.substring(1)) < 0)
							continue;
						String className = getClassName(name);
						CLASSES.add(Class.forName(className));
					} catch (Throwable e) {
					}
				}
			}
		} catch (Throwable e) {
		} finally {
			if (in != null) {
				try {
					in.close();
				} catch (IOException e) {
				}
			}
		}
	}

	private static String getClassName(String path) {
		String className = path.replace('/', '.').replace('\\', '.').replaceAll(".class", "");

		return className;
	}

	public static List<Class<?>> getSubClasses(Class<?> clazz) {
		List<Class<?>> subClasses = SUB_CLASSES_MAP.get(clazz);
		if (subClasses == null) {
			subClasses = new ArrayList<Class<?>>(10);
			for (Class<?> tmpClass : CLASSES) {
				if (clazz.isAssignableFrom(tmpClass) && !tmpClass.isAssignableFrom(clazz)) {
					subClasses.add(tmpClass);
				}
			}
			SUB_CLASSES_MAP.put(clazz, subClasses);
		}
		return Collections.unmodifiableList(subClasses);
	}

}