import { StatusBar } from "expo-status-bar";
import { useState, useRef } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
  Dimensions,
  SafeAreaView,
  Animated,
} from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import { LinearGradient } from "expo-linear-gradient";

const { height } = Dimensions.get("window");

export default function App() {
  const [facing, setFacing] = useState("back");
  const [permission, requestPermission] = useCameraPermissions();
  const [photos, setPhotos] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState("none");
  const [isCapturing, setIsCapturing] = useState(false);
  const cameraRef = useRef(null);
  const scaleAnim = useRef(new Animated.Value(1)).current;

  // Filtros que funcionan en React Native
  const filters = [
    {
      name: "none",
      label: "Fotos",
      icon: "📸",
      colors: ["#667eea", "#764ba2"],
    },
    {
      name: "warm",
      label: "🌅 Cálido",
      icon: "☀️",
      colors: ["#f093fb", "#f5576c"],
    },
    {
      name: "cool",
      label: "❄️ Frío",
      icon: "🌊",
      colors: ["#4facfe", "#00f2fe"],
    },
    {
      name: "vintage",
      label: "📷 Vintage",
      icon: "🎞️",
      colors: ["#ffecd2", "#fcb69f"],
    },
  ];

  if (!permission) {
    return (
      <SafeAreaView style={styles.container}>
        <LinearGradient
          colors={["#667eea", "#764ba2"]}
          style={styles.container}
        >
          <View style={styles.centerContent}>
            <Text style={styles.loadingText}>📱 Cargando cámara...</Text>
          </View>
        </LinearGradient>
      </SafeAreaView>
    );
  }

  if (!permission.granted) {
    return (
      <SafeAreaView style={styles.container}>
        <LinearGradient
          colors={["#667eea", "#764ba2"]}
          style={styles.container}
        >
          <View style={styles.centerContent}>
            <View style={styles.permissionCard}>
              <Text style={styles.permissionIcon}>📷</Text>
              <Text style={styles.permissionTitle}>
                ¡Necesitamos la cámara!
              </Text>
              <Text style={styles.permissionMessage}>
                Para tomar fotos increíbles con filtros geniales
              </Text>
              <TouchableOpacity
                style={styles.permissionButton}
                onPress={requestPermission}
              >
                <LinearGradient
                  colors={["#f093fb", "#f5576c"]}
                  style={styles.permissionButtonGradient}
                >
                  <Text style={styles.permissionButtonText}>
                    ✨ Activar Cámara
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </LinearGradient>
      </SafeAreaView>
    );
  }

  const toggleCameraFacing = () => {
    setFacing((current) => (current === "back" ? "front" : "back"));
  };

  const animateCapture = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.8,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const takePicture = async () => {
    if (cameraRef.current && !isCapturing) {
      try {
        setIsCapturing(true);
        animateCapture();

        const photo = await cameraRef.current.takePictureAsync({
          quality: 0.8,
          base64: false,
        });

        const newPhoto = {
          ...photo,
          filter: selectedFilter,
          id: Date.now().toString(),
          timestamp: new Date().toLocaleTimeString(),
        };

        setPhotos((prevPhotos) => [newPhoto, ...prevPhotos]);

        // Feedback visual
        setTimeout(() => {
          Alert.alert(
            "📸 ¡Foto capturada!",
            "Tu foto se guardó con el filtro seleccionado",
          );
        }, 300);
        // eslint-disable-next-line no-unused-vars
      } catch (error) {
        Alert.alert("❌ Error", "No se pudo tomar la foto");
      } finally {
        setIsCapturing(false);
      }
    }
  };

  const deletePhoto = (photoId) => {
    Alert.alert(
      "🗑️ Eliminar foto",
      "¿Estás seguro de que quieres eliminar esta foto?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: () =>
            setPhotos((prevPhotos) =>
              prevPhotos.filter((photo) => photo.id !== photoId),
            ),
        },
      ],
    );
  };

  const clearAllPhotos = () => {
    Alert.alert("🗑️ Limpiar galería", "¿Quieres eliminar todas las fotos?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Eliminar todas",
        style: "destructive",
        onPress: () => setPhotos([]),
      },
    ]);
  };

  const selectedFilterData = filters.find((f) => f.name === selectedFilter);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContainer}
    >
      <StatusBar style="light" />

      {/* Header con título */}
      <View style={styles.header}>
        <LinearGradient
          colors={selectedFilterData?.colors || ["#667eea", "#764ba2"]}
          style={styles.headerGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        >
          <Text style={styles.headerTitle}>📷 PhotoMagic</Text>
          <Text style={styles.headerSubtitle}>
            {selectedFilterData?.icon} {selectedFilterData?.label}
          </Text>
        </LinearGradient>
      </View>

      {/* Contenedor de la cámara */}
      <View style={styles.cameraContainer}>
        <CameraView style={styles.camera} facing={facing} ref={cameraRef} />

        {/* Overlay con filtro de color - FUERA del CameraView */}
        {selectedFilter !== "none" && (
          <View
            style={[styles.filterOverlay, getFilterStyle(selectedFilter)]}
          />
        )}

        {/* Marco decorativo - FUERA del CameraView */}
        <View style={styles.cameraFrame} />

        {/* Controles superiores - FUERA del CameraView */}
        <View style={styles.topControls}>
          <TouchableOpacity
            style={styles.topButton}
            onPress={toggleCameraFacing}
          >
            <Text style={styles.topButtonIcon}>🔄</Text>
            <Text style={styles.topButtonText}>Cambiar</Text>
          </TouchableOpacity>

          <View style={styles.photoCounter}>
            <Text style={styles.photoCounterText}>📷 {photos.length}</Text>
          </View>
        </View>

        {/* Controles inferiores - FUERA del CameraView */}
        <View style={styles.bottomControls}>
          <Animated.View
            style={[
              styles.captureButtonContainer,
              { transform: [{ scale: scaleAnim }] },
            ]}
          >
            <TouchableOpacity
              style={[
                styles.captureButton,
                isCapturing && styles.captureButtonDisabled,
              ]}
              onPress={takePicture}
              disabled={isCapturing}
            >
              <LinearGradient
                colors={isCapturing ? ["#999", "#666"] : ["#fff", "#f0f0f0"]}
                style={styles.captureButtonGradient}
              >
                <Text style={styles.captureButtonIcon}>
                  {isCapturing ? "⏳" : "📸"}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </View>

      {/* Filtros */}
      <View style={styles.filtersSection}>
        <LinearGradient
          colors={["#1a1a2e", "#16213e"]}
          style={styles.filtersBackground}
        >
          <Text style={styles.filtersTitle}>✨ Filtros</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filtersContainer}
          >
            {filters.map((filter) => (
              <TouchableOpacity
                key={filter.name}
                style={styles.filterButton}
                onPress={() => setSelectedFilter(filter.name)}
              >
                <LinearGradient
                  colors={
                    selectedFilter === filter.name
                      ? filter.colors
                      : ["#333", "#444"]
                  }
                  style={[
                    styles.filterButtonGradient,
                    selectedFilter === filter.name && styles.filterButtonActive,
                  ]}
                >
                  <Text style={styles.filterIcon}>{filter.icon}</Text>
                  <Text
                    style={[
                      styles.filterText,
                      selectedFilter === filter.name && styles.filterTextActive,
                    ]}
                  >
                    {filter.label.split(" ")[1]}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </LinearGradient>
      </View>

      {/* Galería de fotos mejorada */}
      {photos.length > 0 && (
        <View style={styles.gallery}>
          <LinearGradient
            colors={["#0f0f23", "#1a1a2e"]}
            style={styles.galleryBackground}
          >
            <View style={styles.galleryHeader}>
              <Text style={styles.galleryTitle}>
                🖼️ Tu Galería ({photos.length})
              </Text>
              <TouchableOpacity
                onPress={clearAllPhotos}
                style={styles.clearButton}
              >
                <LinearGradient
                  colors={["#ff6b6b", "#ee5a52"]}
                  style={styles.clearButtonGradient}
                >
                  <Text style={styles.clearButtonText}>🗑️ Limpiar</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.galleryScrollContent}
              style={styles.galleryScroll}
            >
              {photos.map((photo, index) => (
                <TouchableOpacity
                  key={photo.id}
                  style={[
                    styles.photoContainer,
                    { marginLeft: index === 0 ? 20 : 10 },
                    { marginRight: index === photos.length - 1 ? 20 : 0 },
                  ]}
                  onPress={() => deletePhoto(photo.id)}
                  activeOpacity={0.8}
                >
                  <View style={styles.photoCard}>
                    <Image
                      source={{ uri: photo.uri }}
                      style={styles.photo}
                      resizeMode="cover"
                    />
                    <View
                      style={[
                        styles.photoFilterOverlay,
                        getFilterStyle(photo.filter),
                      ]}
                    />
                    <LinearGradient
                      colors={["transparent", "rgba(0,0,0,0.8)"]}
                      style={styles.photoInfo}
                    >
                      <Text style={styles.photoTime}>{photo.timestamp}</Text>
                      <Text style={styles.photoFilter}>
                        {filters.find((f) => f.name === photo.filter)?.icon}
                      </Text>
                    </LinearGradient>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </LinearGradient>
        </View>
      )}
    </ScrollView>
  );
}

// Función para obtener estilos de filtro que funcionan en React Native
function getFilterStyle(filterName) {
  switch (filterName) {
    case "warm":
      return { backgroundColor: "rgba(255, 165, 0, 0.15)" };
    case "cool":
      return { backgroundColor: "rgba(0, 191, 255, 0.15)" };
    case "vintage":
      return { backgroundColor: "rgba(139, 69, 19, 0.2)" };
    default:
      return {};
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  scrollContainer: {
    flexGrow: 1,
  },
  centerContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  loadingText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  permissionCard: {
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 20,
    padding: 30,
    alignItems: "center",
    backdropFilter: "blur(10px)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
  },
  permissionIcon: {
    fontSize: 60,
    marginBottom: 20,
  },
  permissionTitle: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  permissionMessage: {
    color: "#ddd",
    fontSize: 16,
    textAlign: "center",
    marginBottom: 30,
    lineHeight: 22,
  },
  permissionButton: {
    borderRadius: 25,
    overflow: "hidden",
  },
  permissionButtonGradient: {
    paddingHorizontal: 30,
    paddingVertical: 15,
  },
  permissionButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  header: {
    height: 80,
    overflow: "hidden",
  },
  headerGradient: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 10,
    justifyContent: "center",
  },
  headerTitle: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
  },
  headerSubtitle: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 14,
    marginTop: 2,
  },
  cameraContainer: {
    height: height * 0.5, // Altura fija del 50% de la pantalla
    margin: 10,
    borderRadius: 20,
    overflow: "hidden",
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    position: "relative",
  },
  camera: {
    flex: 1,
  },
  filterOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    pointerEvents: "none",
  },
  cameraFrame: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderWidth: 3,
    borderColor: "rgba(255,255,255,0.3)",
    borderRadius: 20,
    pointerEvents: "none",
  },
  topControls: {
    position: "absolute",
    top: 20,
    left: 20,
    right: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  topButton: {
    backgroundColor: "rgba(0,0,0,0.6)",
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 8,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.3)",
  },
  topButtonIcon: {
    fontSize: 16,
    marginRight: 5,
  },
  topButtonText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
  photoCounter: {
    backgroundColor: "rgba(0,0,0,0.6)",
    borderRadius: 15,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.3)",
  },
  photoCounterText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
  bottomControls: {
    position: "absolute",
    bottom: 30,
    left: 0,
    right: 0,
    alignItems: "center",
  },
  captureButtonContainer: {
    alignItems: "center",
  },
  captureButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  captureButtonGradient: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: "#333",
  },
  captureButtonIcon: {
    fontSize: 28,
  },
  captureButtonDisabled: {
    opacity: 0.7,
  },
  filtersSection: {
    height: 120,
  },
  filtersBackground: {
    flex: 1,
    paddingTop: 15,
  },
  filtersTitle: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  filtersContainer: {
    paddingHorizontal: 15,
  },
  filterButton: {
    marginHorizontal: 5,
    borderRadius: 15,
    overflow: "hidden",
  },
  filterButtonGradient: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "transparent",
  },
  filterButtonActive: {
    borderColor: "#fff",
  },
  filterIcon: {
    fontSize: 20,
    marginBottom: 4,
  },
  filterText: {
    color: "#ccc",
    fontSize: 12,
    fontWeight: "bold",
  },
  filterTextActive: {
    color: "#fff",
  },
  gallery: {
    height: 140, // Altura fija más grande para que se vea mejor
    marginBottom: 20, // Margen inferior para scroll
  },
  galleryBackground: {
    flex: 1,
    paddingTop: 10,
  },
  galleryHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 10,
    height: 40,
  },
  galleryTitle: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  clearButton: {
    borderRadius: 20,
    overflow: "hidden",
  },
  clearButtonGradient: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    flexDirection: "row",
    alignItems: "center",
  },
  clearButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
  galleryScroll: {
    flex: 1,
  },
  galleryScrollContent: {
    alignItems: "center",
    paddingVertical: 5,
  },
  photoContainer: {
    alignItems: "center",
  },
  photoCard: {
    borderRadius: 12,
    overflow: "hidden",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    backgroundColor: "#333",
  },
  photo: {
    width: 80,
    height: 80,
  },
  photoFilterOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  photoInfo: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 25,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 8,
  },
  photoTime: {
    color: "#fff",
    fontSize: 8,
    fontWeight: "bold",
  },
  photoFilter: {
    fontSize: 12,
  },
});
