# Banco de 40 Proyectos — IA Ética y Ciberseguridad para el Sector Público

**Hackathon UNETI IA · 2 días · 10 equipos de 5**
Enfoque: soluciones de **Inteligencia Artificial Ética** y **Ciberseguridad**, con **visión de despliegue en entes públicos**.

> **Nivel de ambición:** estos proyectos están pensados como **sistemas desplegables por el Estado** (ministerios, entes reguladores, gobernaciones, alcaldías, salud pública, seguridad), no como demos académicos.
> **Cómo trabajar en 2 días:** cada equipo construye un **MVP del componente central** (piloto funcional) con una arquitectura, plan de datos y visión de escalamiento claros. La complejidad describe la **solución objetivo**.
>
> **Complejidad:** 🟡 Media · 🔴 Avanzada
> **Entes públicos de referencia (Venezuela):** MPPCT, CNTI, CONATEL, INE, SENIAT, ministerios de Salud/Educación/Interior, gobernaciones, alcaldías, cuerpos de seguridad, institutos de salud, empresas del Estado.

---

## Eje 1 — IA Ética y Responsable para el Sector Público (1–20)

**1. Plataforma nacional de auditoría algorítmica** 🔴
- **Problema:** los entes públicos adoptan modelos de IA sin evaluar si discriminan o vulneran derechos.
- **Solución:** sistema que evalúa modelos del Estado en equidad, precisión por grupo y cumplimiento normativo antes de su despliegue.
- **Despliegue:** MPPCT/CNTI como órgano rector que audita algoritmos de toda la administración.

**2. Registro soberano de modelos de IA del Estado** 🔴
- **Problema:** falta trazabilidad de qué modelos, datos y versiones usa cada ente.
- **Solución:** ledger institucional (versionado + metadatos + responsables) con gobernanza y rendición de cuentas.
- **Despliegue:** CNTI como repositorio central de activos de IA de la administración pública.

**3. Generador de "Fichas de modelo" con validez regulatoria** 🟡
- **Problema:** no hay documentación estandarizada de los modelos para licitaciones y fiscalización.
- **Solución:** motor que autogenera model cards de cumplimiento (uso, límites, métricas, sesgos).
- **Despliegue:** requisito en compras públicas y registro ante el ente rector.

**4. Motor de equidad para programas sociales y becas** 🟡
- **Problema:** la asignación automatizada de subsidios/becas puede reproducir sesgos.
- **Solución:** capa de fairness que mide y corrige disparidad de impacto en los criterios de asignación.
- **Despliegue:** ministerios sociales y de educación para decisiones auditables y justas.

**5. Sistema de explicabilidad de decisiones administrativas** 🔴
- **Problema:** el ciudadano no entiende por qué un trámite o beneficio fue rechazado.
- **Solución:** motor que traduce la decisión de un modelo a explicación clara (derecho a explicación).
- **Despliegue:** ventanilla única de trámites y entes con decisiones automatizadas.

**6. Anonimización de datos para datos abiertos del Estado** 🟡
- **Problema:** publicar datos oficiales sin filtrar datos personales frena la transparencia.
- **Solución:** pipeline de redacción de PII (cédulas, nombres, teléfonos) en documentos y datasets a escala.
- **Despliegue:** INE y portales de datos abiertos que cumplen privacidad sin perder utilidad.

**7. Plataforma de privacidad diferencial para estadísticas públicas** 🔴
- **Problema:** las estadísticas agregadas pueden reidentificar a ciudadanos.
- **Solución:** consultas con ruido calibrado que garantizan privacidad manteniendo utilidad estadística.
- **Despliegue:** INE y observatorios públicos para difundir estadísticas seguras.

**8. Sistema de gestión de consentimiento y derechos del titular** 🟡
- **Problema:** los entes no gestionan el consentimiento ni los derechos de acceso/rectificación de datos.
- **Solución:** plataforma de gestión de datos personales ciudadanos (consentimiento, solicitudes, trazabilidad).
- **Despliegue:** cumplimiento de leyes de protección de datos en toda la administración.

**9. Detector de desinformación para la esfera pública** 🔴
- **Problema:** narrativas falsas afectan la confianza institucional y la estabilidad.
- **Solución:** sistema de monitoreo y verificación de afirmaciones contra fuentes con nivel de confianza.
- **Despliegue:** entes de comunicación oficial y observatorios ciudadanos.

**10. Verificación de identidad documental con detección de fraude** 🔴
- **Problema:** documentos falsificados vulneran trámites y registros públicos.
- **Solución:** sistema que detecta alteraciones y verifica autenticidad de documentos e identidades.
- **Despliegue:** registros civiles, migración, notarías y trámites de identidad.

**11. Asistente ciudadano estatal con IA explicable** 🟡
- **Problema:** la atención ciudadana es lenta y opaca; los chatbots no dan trazabilidad.
- **Solución:** ventanilla única con respuestas que citan fuentes, muestran confianza y auditan cada interacción.
- **Despliegue:** portales de gobernaciones y alcaldías como primera línea de atención.

**12. Evaluación de impacto algorítmico (DPIA algorítmico)** 🔴
- **Problema:** se despliega IA sin evaluar riesgos a derechos fundamentales.
- **Solución:** marco que evalúa y documenta riesgos de un algoritmo antes de su uso público.
- **Despliegue:** requisito obligatorio previo a licitar o habilitar sistemas de IA.

**13. Observatorio de transparencia algorítmica** 🟡
- **Problema:** los algoritmos del Estado operan sin visibilidad pública.
- **Solución:** panel público que explica qué algoritmos se usan, con qué datos y con qué salvaguardas.
- **Despliegue:** rendición de cuentas ante la ciudadanía y la Contraloría.

**14. IA explicable de apoyo al diagnóstico en salud pública** 🔴
- **Problema:** el personal de salud necesita apoyo clínico confiable y justificable.
- **Solución:** sistema que sugiere diagnósticos con evidencia, confianza y explicación para el clínico.
- **Despliegue:** institutos de salud y hospitales públicos, con supervisión humana obligatoria.

**15. Plataforma de datos sintéticos con privacidad** 🔴
- **Problema:** compartir datos entre entes expone información personal.
- **Solución:** generación de datasets sintéticos que preservan utilidad sin datos reales identificables.
- **Despliegue:** colaboración interinstitucional e investigación sin vulnerar privacidad.

**16. Detector de deepfakes para comunicados oficiales** 🔴
- **Problema:** audios/videos falsos de autoridades pueden desestabilizar.
- **Solución:** verificación de autenticidad de contenido audiovisual institucional.
- **Despliegue:** protección de la integridad de la comunicación del Estado.

**17. Trazabilidad de decisiones automatizadas (ledger)** 🔴
- **Problema:** no se puede auditar quién decidió qué ni con qué criterio.
- **Solución:** registro inmutable de decisiones con justificación, modelo y datos usados.
- **Despliegue:** fiscalización y defensa ante reclamos administrativos.

**18. Guardián de integridad de LLMs en servicios públicos** 🟡
- **Problema:** los asistentes del Estado son vulnerables a inyección de prompts y mal uso.
- **Solución:** filtro que detecta y bloquea prompts maliciosos y respuestas fuera de política.
- **Despliegue:** capa de seguridad en cualquier chatbot gubernamental.

**19. Detector de sesgo en contratación pública** 🟡
- **Problema:** procesos de selección/contratación pueden tener criterios sesgados.
- **Solución:** monitoreo de criterios y resultados para detectar y corregir disparidades.
- **Despliegue:** oficinas de talento humano y compras públicas.

**20. Plataforma de certificación en IA ética para servidores públicos** 🟡
- **Problema:** los funcionarios que deciden sobre IA carecen de formación en ética.
- **Solución:** programa de formación + evaluación continua con certificación.
- **Despliegue:** MPPCT/CNTI como escuela de gobernanza de IA del Estado.

---

## Eje 2 — Ciberseguridad para el Sector Público (21–40)

**21. SOC nacional asistido por IA (SIEM + detección)** 🔴
- **Problema:** los entes públicos detectan incidentes tarde o no los detectan.
- **Solución:** centro de monitoreo que correlaciona eventos de múltiples entes y prioriza alertas.
- **Despliegue:** CSIRT nacional / CNTI protegiendo a toda la administración.

**22. Plataforma de inteligencia de amenazas (CTI) para infraestructura crítica** 🔴
- **Problema:** falta visión de amenazas sobre sectores críticos (energía, agua, telecom).
- **Solución:** agregación de fuentes de amenazas + alertas tempranas dirigidas a cada sector.
- **Despliegue:** entes reguladores y operadores de infraestructura crítica.

**23. IDS/IPS para redes gubernamentales** 🔴
- **Problema:** las redes del Estado son blanco constante de intrusión.
- **Solución:** detección/prevención de intrusos con ML sobre tráfico de red estatal.
- **Despliegue:** perímetro de seguridad de ministerios y gobernaciones.

**24. Motor de detección de phishing dirigido a funcionarios** 🟡
- **Problema:** el phishing por correo es la puerta de entrada más común a los entes.
- **Solución:** análisis de correos institucionales con alertas y educación al usuario.
- **Despliegue:** protección del correo oficial de toda la administración.

**25. Protección de sistemas SCADA/IoT industrial** 🔴
- **Problema:** los sistemas industriales (agua, energía) son vulnerables y poco monitoreados.
- **Solución:** monitoreo de anomalías en redes industriales y dispositivos IoT.
- **Despliegue:** operadores de servicios públicos y empresas del Estado.

**26. Gestión de identidad y acceso con riesgo adaptativo (IAM)** 🟡
- **Problema:** accesos estáticos y contraseñas débiles exponen sistemas públicos.
- **Solución:** autenticación continua que evalúa riesgo (dispositivo, ubicación, comportamiento).
- **Despliegue:** control de acceso a sistemas de misión crítica del Estado.

**27. Identidad digital ciudadana y firma electrónica segura** 🔴
- **Problema:** los trámites presenciales dependen de identidades verificables y firmas.
- **Solución:** plataforma de identidad digital con autenticación fuerte y firma electrónica.
- **Despliegue:** base para la transformación digital de trámites públicos.

**28. CSIRT con triaje y playbooks automatizados** 🔴
- **Problema:** la respuesta a incidentes es lenta y manual.
- **Solución:** automatización del triaje, correlación y playbooks de respuesta.
- **Despliegue:** coordinación de respuesta entre entes ante ciberincidentes.

**29. Analizador de malware a escala nacional (sandbox + ML)** 🔴
- **Problema:** muestras maliciosas circulan sin análisis centralizado.
- **Solución:** plataforma de análisis de malware (estático + dinámico + ML) compartida.
- **Despliegue:** servicio central para entes sin capacidad propia de análisis.

**30. Escáner de vulnerabilidades de aplicaciones del Estado** 🟡
- **Problema:** el software público acumula vulnerabilidades conocidas.
- **Solución:** SAST/DAST + verificación de CVEs sobre aplicaciones y dependencias.
- **Despliegue:** aseguramiento continuo del desarrollo gubernamental.

**31. Sistema de prevención de fuga de datos (DLP)** 🔴
- **Problema:** información clasificada y datos ciudadanos se filtran por error o malicia.
- **Solución:** monitoreo y bloqueo de transferencias no autorizadas de datos sensibles.
- **Despliegue:** protección de datos del Estado y de los ciudadanos.

**32. Gestión de superficie de ataque (attack surface)** 🟡
- **Problema:** los entes no conocen sus activos digitales expuestos.
- **Solución:** descubrimiento continuo de activos y exposición para priorizar remediación.
- **Despliegue:** inventario de riesgo digital de cada ente.

**33. Detección de fraude en programas sociales** 🔴
- **Problema:** subsidios y beneficios sufren cobros duplicados o irregulares.
- **Solución:** detección de patrones de fraude y duplicidad en la asignación de beneficios.
- **Despliegue:** ministerios sociales y sistemas de protección de subsidios.

**34. Anti-bots y anti-fraude en trámites en línea** 🟡
- **Problema:** portales de servicios públicos son atacados por bots y automatismos.
- **Solución:** detección de tráfico automatizado y protección de formularios.
- **Despliegue:** portales de trámites y consultas ciudadanas.

**35. Integridad y auditoría de procesos electorales/consultas** 🔴
- **Problema:** la confianza en procesos de votación o consulta exige integridad verificable.
- **Solución:** sistema con auditoría criptográfica y trazabilidad de cada voto/consulta.
- **Despliegue:** entes electorales y mecanismos de consulta pública.

**36. Plataforma de coordinación de incidentes entre entes** 🟡
- **Problema:** los entes responden a incidentes de forma aislada y sin coordinación.
- **Solución:** plataforma de reporte, clasificación y coordinación de respuesta nacional.
- **Despliegue:** canal oficial de comunicación entre CSIRT y administración.

**37. OSINT de amenazas con NLP sobre fuentes abiertas** 🔴
- **Problema:** las amenazas se anuncian en foros y mercados antes de atacar.
- **Solución:** monitoreo de fuentes abiertas (foros, leaks) con análisis de lenguaje.
- **Despliegue:** alerta temprana para cuerpos de seguridad y entes críticos.

**38. Ciber-resiliencia y continuidad de servicios públicos** 🟡
- **Problema:** un ataque puede dejar caídos servicios esenciales por días.
- **Solución:** respaldos verificados y planes de recuperación automatizados y probados.
- **Despliegue:** garantía de continuidad operativa de servicios ciudadanos.

**39. Protección de datos biométricos del Estado** 🔴
- **Problema:** la identidad biométrica es crítica y su filtración es irreversible.
- **Solución:** almacenamiento y uso seguro (cifrado, control de acceso, auditoría).
- **Despliegue:** registros de identidad y sistemas que usan biometría.

**40. Observatorio nacional de ciberseguridad** 🟡
- **Problema:** no hay visibilidad pública del panorama de amenazas del país.
- **Solución:** panel de métricas, incidentes y alertas para decisores y ciudadanía.
- **Despliegue:** gobernanza y transparencia del riesgo ciber del Estado.

---

## Cómo asignar los 10 equipos

- **Reparto sugerido:** 5 equipos en Eje 1 (IA Ética) y 5 en Eje 2 (Ciberseguridad).
- Cada equipo construye el **MVP del componente central** (piloto) con: arquitectura, fuente de datos, prototipo funcional y plan de despliegue en el ente público objetivo.
- La evaluación premia no solo lo técnico, sino la **viabilidad de adopción por el Estado** (gobernanza, seguridad, escalabilidad y ética).

### Proyectos "insignia" recomendados para impacto institucional
- **Eje 1:** #1 Auditoría algorítmica, #6 Anonimización de datos abiertos, #9 Anti-desinformación, #11 Asistente ciudadano explicable, #12 DPIA algorítmico.
- **Eje 2:** #21 SOC nacional, #24 Anti-phishing institucional, #30 Escáner de vulnerabilidades, #33 Anti-fraude en subsidios, #36 Coordinación de incidentes.
